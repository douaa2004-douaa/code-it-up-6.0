CREATE TABLE IF NOT EXISTS inventory_transactions (
  id            SERIAL PRIMARY KEY,
  inventory_id  INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
  change_amount INTEGER NOT NULL,
  reason        TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);
