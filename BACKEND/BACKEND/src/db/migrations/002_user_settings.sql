CREATE TABLE IF NOT EXISTS user_settings (
  id                    SERIAL PRIMARY KEY,
  user_id               INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme                 TEXT DEFAULT 'light',
  language              TEXT DEFAULT 'en',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  UNIQUE (user_id)
);
