CREATE TABLE IF NOT EXISTS users (
  discord_id VARCHAR PRIMARY KEY,
  username VARCHAR,
  total_ml INT DEFAULT 0,
  streak INT DEFAULT 0,
  last_drink TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drinks (
  id SERIAL PRIMARY KEY,
  discord_id VARCHAR,
  amount_ml INT,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'UTC')
);
