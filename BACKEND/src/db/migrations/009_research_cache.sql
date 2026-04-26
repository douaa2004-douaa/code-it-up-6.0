CREATE TABLE IF NOT EXISTS research_cache (
  id         SERIAL PRIMARY KEY,
  cache_key  TEXT UNIQUE NOT NULL,
  response   TEXT,
  model      TEXT,
  hit_count  INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
