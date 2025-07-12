import { pool } from './db.js'

const SQL = `
CREATE TABLE IF NOT EXISTS users (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   username VARCHAR ( 255 ),
   password VARCHAR ( 255 )
);
`
try {
  console.log('🔃Creating tables')
  await pool.query(SQL)
  console.log('✅Tables inserted')
} catch (err) {
  console.log('Error seeding table: ', err)
}
