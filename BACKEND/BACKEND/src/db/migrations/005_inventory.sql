CREATE TABLE IF NOT EXISTS inventory (
  id                  SERIAL PRIMARY KEY,
  project_id          INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  name                TEXT NOT NULL,
  quantity            NUMERIC(12,3) DEFAULT 0,
  unit                TEXT,
  low_stock_threshold NUMERIC(12,3),
  barcode             TEXT,
  supplier            TEXT,
  notes               TEXT,
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);
