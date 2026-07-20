-- SkillForge Academy — Access Token Migration
-- Run this once against your Supabase project via the SQL Editor.

-- 1. Add full_name and telegram_chat_id to the purchases table
ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT;

-- 2. Create the access_tokens table
CREATE TABLE IF NOT EXISTS access_tokens (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  token           TEXT        UNIQUE NOT NULL,
  purchase_id     UUID        REFERENCES purchases(id) ON DELETE CASCADE,
  used            BOOLEAN     DEFAULT false NOT NULL,
  used_at         TIMESTAMPTZ,
  telegram_chat_id BIGINT,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_access_tokens_token ON access_tokens(token);
