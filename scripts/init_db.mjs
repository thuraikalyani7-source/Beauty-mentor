import pg from 'pg';
const { Pool } = pg;

const connectionString = 'postgresql://beauty_mentor_user:XkGnPfrEoN5BNh8CCRYNgkrm3gpjflTG@dpg-dbo6lc8u01pc73edibog-a.oregon-postgres.render.com:5432/beauty_mentor';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const client = await pool.connect();
  console.log('Connected to Render PostgreSQL!');

  await client.query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
    CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
  `);

  console.log('Database tables successfully created on Render PostgreSQL!');
  const res = await client.query('SELECT tablename FROM pg_tables WHERE schemaname = $1', ['public']);
  console.log('Existing tables in DB:', res.rows.map(r => r.tablename));

  client.release();
  await pool.end();
}

main().catch(err => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});
