-- Persistent AI Assistant chat foundation. This file is review-only until you run it.

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint conversations_id_user_id_key unique (id, user_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(btrim(content)) between 1 and 20000),
  image_object_path text,
  created_at timestamptz not null default now(),
  constraint messages_conversation_owner_fkey
    foreign key (conversation_id, user_id)
    references public.conversations (id, user_id)
    on delete cascade,
  constraint messages_image_path_owner_check
    check (
      image_object_path is null
      or (
        role = 'user'
        and char_length(image_object_path) > 37
        and left(image_object_path, 37) = user_id::text || '/'
      )
    )
);

create index conversations_user_created_at_idx
  on public.conversations (user_id, created_at desc);

create index messages_user_conversation_created_at_idx
  on public.messages (user_id, conversation_id, created_at);

create index messages_conversation_user_created_at_idx
  on public.messages (conversation_id, user_id, created_at);

comment on column public.messages.image_object_path is
  'Optional path in a future private Supabase Storage bucket; stores no image bytes. Use the owning user UUID as the first path segment and enforce Storage RLS separately.';

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

revoke all on table public.conversations, public.messages from anon, public;
grant select, insert, update, delete on table public.conversations, public.messages to authenticated;

create policy conversations_select_own
  on public.conversations for select to authenticated
  using (user_id = (select auth.uid()));

create policy conversations_insert_own
  on public.conversations for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy conversations_update_own
  on public.conversations for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy conversations_delete_own
  on public.conversations for delete to authenticated
  using (user_id = (select auth.uid()));

create policy messages_select_own
  on public.messages for select to authenticated
  using (user_id = (select auth.uid()));

create policy messages_insert_own
  on public.messages for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy messages_update_own
  on public.messages for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy messages_delete_own
  on public.messages for delete to authenticated
  using (user_id = (select auth.uid()));
