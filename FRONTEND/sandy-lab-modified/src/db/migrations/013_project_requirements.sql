CREATE TABLE IF NOT EXISTS project_requirements (
  id                SERIAL PRIMARY KEY,
  project_id        INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  inventory_id      INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
  required_quantity INTEGER NOT NULL,
  created_at        TIMESTAMP DEFAULT NOW()
);
