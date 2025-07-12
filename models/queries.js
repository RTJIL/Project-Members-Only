import { pool } from '../db/db.js'

const postUser = async (username, pass) => {
  const SQL = `
     INSERT INTO users (username, password)
     VALUES ($1, $2);
    `
  try {
    console.log('🔃Posting user to DB')
    await pool.query(SQL, [username, pass])
    console.log('✅User added')
  } catch (err) {
    console.log('⛔Error: ', err)
  }
}

const getAllUsers = async () => {
  try {
    console.log('🔃Getting users from DB')
    const users = await pool.query(`SELECT * FROM users`)
    console.log('✅Complete')
    return users.rows
  } catch (err) {
    console.log('⛔Error: ', err)
  }
}

export default {
  postUser,
  getAllUsers
}
