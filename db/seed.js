//seed.js

import { pool } from './db.js'

const SQL = `
CREATE TABLE IF NOT EXISTS users (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   username VARCHAR ( 255 ),
   password VARCHAR ( 255 ),
   is_verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS messages (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   title TEXT,
   message TEXT,
   user_id INTEGER,
   FOREIGN KEY (user_id) REFERENCES users (id) 
);

CREATE TABLE IF NOT EXISTS session (
  sid varchar NOT NULL COLLATE "default",
  sess json NOT NULL,
  expire timestamp(6) NOT NULL,
  CONSTRAINT session_pkey PRIMARY KEY (sid)
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON session(expire);
`
try {
  console.log('🔃Creating tables')
  await pool.query(SQL)
  console.log('✅Tables inserted')
  console.log('---')
} catch (err) {
  console.log('Error seeding table: ', err)
}
