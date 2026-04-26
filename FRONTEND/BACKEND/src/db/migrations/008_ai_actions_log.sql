CREATE TABLE IF NOT EXISTS ai_actions_log (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  project_id  INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  prompt      TEXT,
  response    TEXT,
  model       TEXT,
  tokens_used INTEGER,
  latency_ms  INTEGER,
  created_at  TIMESTAMP DEFAULT NOW()
);
