CREATE TABLE IF NOT EXISTS agent_tasks (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  project_id   INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  task_type    TEXT NOT NULL,
  status       TEXT DEFAULT 'pending' CHECK (status IN ('pending','running','completed','failed')),
  progress     INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  payload      JSONB,
  result       JSONB,
  error        TEXT,
  created_at   TIMESTAMP DEFAULT NOW(),
  started_at   TIMESTAMP,
  completed_at TIMESTAMP
);
