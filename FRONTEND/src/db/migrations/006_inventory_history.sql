CREATE TABLE IF NOT EXISTS inventory_history (
  id           SERIAL PRIMARY KEY,
  inventory_id INTEGER NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  changed_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  delta        NUMERIC(12,3) NOT NULL,
  reason       TEXT,
  created_at   TIMESTAMP DEFAULT NOW()
);
