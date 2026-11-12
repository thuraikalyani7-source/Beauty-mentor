import express from "express";
import crypto from "node:crypto";
import { Buffer } from "node:buffer";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { GoogleGenAI } from "@google/genai";
import { generateExpertBeautyAdvice } from "./beautyEngine.js";

const { Pool } = pg;

const envFileCandidates = [
  fileURLToPath(new URL("../.env.local", import.meta.url)),
  fileURLToPath(new URL("../.env", import.meta.url)),
  fileURLToPath(new URL("../.env.txt", import.meta.url)),
];
for (const envFile of envFileCandidates) {
  if (existsSync(envFile)) process.loadEnvFile(envFile);
}

const app = express();
const port = Number.parseInt(process.env.PORT || "3001", 10);
const host = process.env.HOST || "0.0.0.0";
const JWT_SECRET = process.env.JWT_SECRET || "beauty_mentor_default_jwt_secret_render";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  process.stderr.write("[CRITICAL ERROR] DATABASE_URL is required in environment variables.\n");
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL && DATABASE_URL.includes("render.com") ? { rejectUnauthorized: false } : false,
});

async function initDb() {
  try {
    const client = await pool.connect();
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
    client.release();
    process.stdout.write("[db] Render PostgreSQL tables initialized successfully.\n");
  } catch (err) {
    process.stderr.write(`[db] Render PostgreSQL initialization error: ${err.message}\n`);
  }
}
initDb();

function signToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expectedSig = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  if (signature !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, salt, storedHash) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  const hashBuf = Buffer.from(hash, "hex");
  const storedBuf = Buffer.from(storedHash, "hex");
  if (hashBuf.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(hashBuf, storedBuf);
}

app.disable("x-powered-by");

// Enable CORS for all origins
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: "7mb", strict: true }));

// --- Authentication Routes (Render PostgreSQL) ---
app.post(["/api/auth/signup", "/api/auth/register"], async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  const cleanEmail = email.trim().toLowerCase();
  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists. Please log in." });
    }

    const { salt, hash } = hashPassword(password);
    const insertRes = await pool.query(
      "INSERT INTO users (email, password_hash, salt) VALUES ($1, $2, $3) RETURNING id, email, created_at",
      [cleanEmail, hash, salt]
    );
    const user = insertRes.rows[0];
    const token = signToken({ id: user.id, email: user.email });

    res.status(201).json({
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (err) {
    process.stderr.write(`[auth signup error] ${err.message}\n`);
    res.status(500).json({ error: "Could not create account. Please try again." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const cleanEmail = email.trim().toLowerCase();
  try {
    const userRes = await pool.query(
      "SELECT id, email, password_hash, salt FROM users WHERE email = $1",
      [cleanEmail]
    );
    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: "No account found with this email. Please click Sign Up to register." });
    }

    const user = userRes.rows[0];
    const isValid = verifyPassword(password, user.salt, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Incorrect password. Please try again." });
    }

    const token = signToken({ id: user.id, email: user.email });
    res.json({
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (err) {
    process.stderr.write(`[auth login error] ${err.message}\n`);
    res.status(500).json({ error: "Sign in failed. Please try again." });
  }
});

app.get("/api/auth/me", async (req, res) => {
  const authHeader = req.get("authorization") || "";
  const match = /^Bearer\s+(.+)$/i.exec(authHeader);
  if (!match) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const payload = verifyToken(match[1]);
  if (!payload) {
    return res.status(401).json({ error: "Session expired or invalid" });
  }
  res.json({ user: { id: payload.id, email: payload.email } });
});

app.post("/api/auth/logout", (_req, res) => {
  res.json({ success: true });
});

// --- Assistant Middleware & Routes ---
function requireAssistantUser(req, res, next) {
  const authHeader = req.get("authorization") || "";
  const match = /^Bearer\s+(.+)$/i.exec(authHeader);
  if (!match) {
    return res.status(401).json({ error: { code: "auth_required", message: "Sign in to use the assistant." } });
  }
  const payload = verifyToken(match[1]);
  if (!payload?.id) {
    return res.status(401).json({ error: { code: "auth_required", message: "Your session has expired. Please sign in again." } });
  }
  req.assistantUserId = payload.id;
  next();
}

function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/assistant/status", (_req, res) => {
  res.json({ configured: true });
});

app.get("/api/assistant/conversations", requireAssistantUser, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, created_at FROM conversations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50",
      [req.assistantUserId]
    );
    res.json({ conversations: result.rows || [] });
  } catch (err) {
    process.stderr.write(`[assistant conversations error] ${err.message}\n`);
    res.status(503).json({ error: { code: "history_unavailable", message: "Chat history could not be loaded." } });
  }
});

app.get("/api/assistant/conversations/:conversationId/messages", requireAssistantUser, async (req, res) => {
  const { conversationId } = req.params;
  if (!isUuid(conversationId)) {
    return res.status(400).json({ error: { code: "invalid_request", message: "Invalid conversation ID." } });
  }
  try {
    const result = await pool.query(
      "SELECT id, role, content, created_at FROM messages WHERE conversation_id = $1 AND user_id = $2 ORDER BY created_at ASC",
      [conversationId, req.assistantUserId]
    );
    res.json({ messages: result.rows || [] });
  } catch (err) {
    process.stderr.write(`[assistant messages error] ${err.message}\n`);
    res.status(503).json({ error: { code: "history_unavailable", message: "Messages could not be loaded." } });
  }
});

app.delete("/api/assistant/conversations", requireAssistantUser, async (req, res) => {
  try {
    await pool.query("DELETE FROM conversations WHERE user_id = $1", [req.assistantUserId]);
    res.json({ deleted: true });
  } catch (err) {
    process.stderr.write(`[assistant delete conversations error] ${err.message}\n`);
    res.status(503).json({ error: { code: "history_unavailable", message: "Conversations could not be deleted." } });
  }
});

const MAX_MESSAGE_LENGTH = 2500;
const MAX_OUTPUT_TOKENS = 1500;

const GEMINI_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.7-flash",
];

const ASSISTANT_SYSTEM_PROMPT = `You are Beauty Mentor, a deeply caring, knowledgeable, empathetic, and human-like AI beauty, skincare, and self-care mentor.
You talk like a real human beauty advisor, professional aesthetician, and supportive best friend.
Key personality and guidelines:
- Speak warmly, engagingly, and naturally (like real human chat apps such as ChatGPT and Gemini).
- Use gentle emojis where appropriate to make the conversation inviting and friendly (e.g. ✨, 🌿, 🧴, 💧).
- Give personalized, science-backed skincare, haircare, makeup, and self-care recommendations tailored directly to what the user describes.
- Ask caring follow-up questions to understand their skin type, climate, budget, or routine better.
- Break down explanations clearly with readable bullet points and steps when giving routines or ingredient pairings.
- Always be supportive, reassuring, and promote healthy skin confidence. Never make rigid medical diagnoses; advise patch-testing and consulting a dermatologist for serious medical symptoms.`;

app.post("/api/assistant/chat", requireAssistantUser, async (req, res) => {
  const body = req.body;
  if (!body || typeof body !== "object" || !body.message || typeof body.message !== "string") {
    return res.status(400).json({ error: { code: "invalid_message", message: "Enter a non-empty message." } });
  }
  const message = body.message.trim();
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(413).json({ error: { code: "message_too_long", message: "Message is too long." } });
  }

  const userId = req.assistantUserId;
  const convId = body.conversationId && isUuid(body.conversationId) ? body.conversationId : crypto.randomUUID();
  const msgId = body.messageId && isUuid(body.messageId) ? body.messageId : crypto.randomUUID();
  const assistantId = body.assistantMessageId && isUuid(body.assistantMessageId) ? body.assistantMessageId : crypto.randomUUID();

  try {
    await pool.query(
      "INSERT INTO conversations (id, user_id) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING",
      [convId, userId]
    );
    await pool.query(
      "INSERT INTO messages (id, conversation_id, user_id, role, content) VALUES ($1, $2, $3, 'user', $4) ON CONFLICT (id) DO NOTHING",
      [msgId, convId, userId, message]
    );

    let reply = null;

    // 1. Try Google Gemini with the configured API key
    const rawApiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
    if (rawApiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: rawApiKey });
        for (const model of GEMINI_MODELS) {
          try {
            const result = await ai.models.generateContent({
              model,
              contents: [{ role: "user", parts: [{ text: message }] }],
              config: {
                systemInstruction: ASSISTANT_SYSTEM_PROMPT,
                temperature: 0.7,
                maxOutputTokens: MAX_OUTPUT_TOKENS,
              },
            });
            if (result && result.text && result.text.trim().length > 0) {
              reply = result.text.trim();
              break;
            }
          } catch (modelErr) {
            process.stderr.write(`[gemini model ${model} unavailable: ${modelErr.message?.substring(0, 60)}]\n`);
          }
        }
      } catch (geminiErr) {
        process.stderr.write(`[gemini sdk init error: ${geminiErr.message}]\n`);
      }
    }

    // 2. If Gemini is temporarily experiencing high demand (503), fall back to Pollinations LLM
    if (!reply) {
      try {
        const polRes = await fetch("https://text.pollinations.ai/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { role: "system", content: ASSISTANT_SYSTEM_PROMPT },
              { role: "user", content: message },
            ],
            model: "openai-fast",
          }),
        });
        if (polRes.ok) {
          const text = await polRes.text();
          if (text && !text.includes("Free limit reached") && text.trim().length > 15) {
            reply = text.trim();
          }
        }
      } catch (polErr) {
        process.stderr.write(`[pollinations fallback error: ${polErr.message}]\n`);
      }
    }

    // 3. Fall back to structured expert beauty knowledge engine
    if (!reply) {
      reply = generateExpertBeautyAdvice(message, body.context);
    }

    await pool.query(
      "INSERT INTO messages (id, conversation_id, user_id, role, content) VALUES ($1, $2, $3, 'assistant', $4) ON CONFLICT (id) DO NOTHING",
      [assistantId, convId, userId, reply]
    );

    res.json({
      reply,
      complete: true,
      finishReason: "STOP",
      conversationId: convId,
      messageId: msgId,
      assistantMessageId: assistantId,
    });
  } catch (err) {
    process.stderr.write(`[chat error] ${err.message}\n`);
    res.status(500).json({ error: { code: "server_error", message: "Failed to generate reply." } });
  }
});

// --- Static Frontend Serving ---
const distDir = fileURLToPath(new URL("../dist", import.meta.url));
if (existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(distDir, "index.html"));
    }
    next();
  });
}

app.listen(port, host, () => {
  process.stdout.write(`Beauty Mentor unified server listening on http://${host}:${port}\n`);
});
