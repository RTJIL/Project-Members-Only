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
`
try {
  console.log('🔃Creating tables')
  await pool.query(SQL)
  console.log('✅Tables inserted')
  console.log('---')
} catch (err) {
  console.log('Error seeding table: ', err)
}
