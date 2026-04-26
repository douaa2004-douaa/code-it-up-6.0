CREATE TABLE IF NOT EXISTS experiments (
  id           SERIAL PRIMARY KEY,
  project_id   INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name         TEXT NOT NULL,
  hypothesis   TEXT,
  status       TEXT DEFAULT 'draft' CHECK (status IN ('draft','running','completed','failed')),
  results      JSONB,
  started_at   TIMESTAMP,
  completed_at TIMESTAMP,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);
