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
    console.log('---')
  } catch (err) {
    console.log('⛔Error: ', err)
    throw err
  }
}

const getAllUsers = async () => {
  const SQL = `SELECT * FROM users`

  try {
    console.log('🔃Getting users from DB')

    const users = await pool.query(SQL)

    console.log('✅Complete')
    console.log('---')
    return users.rows
  } catch (err) {
    console.log('⛔Error: ', err)
    return []
  }
}

const getUserById = async (id) => {
  const SQL = `SELECT * FROM users WHERE id = $1`

  try {
    console.log('🔃Getting users by name from DB')

    const result = await pool.query(SQL, [id])

    console.log('✅Complete')
    console.log('---')
    return result.rows[0] || null
  } catch (err) {
    console.log('⛔Error: ', err)
    return null
  }
}

const getUserByUname = async (username) => {
  const SQL = `SELECT * FROM users WHERE username = $1`

  try {
    console.log('🔃Getting users by name from DB')

    const result = await pool.query(SQL, [username])

    console.log('✅Complete')
    console.log('---')
    return result.rows[0] || null
  } catch (err) {
    console.log('⛔Error: ', err)
    return null
  }
}

const postMessage = async (title, message, user_id) => {
  const SQL = `
     INSERT INTO messages (title, message, user_id)
     VALUES ($1, $2, $3);
  `
  try {
    console.log('🔃Posting message to DB')
    await pool.query(SQL, [title, message, user_id])
    console.log('✅Message added')
    console.log('---')
  } catch (err) {
    console.log('⛔Error: ', err)
    throw err
  }
}

const getAllMessages = async () => {
  const SQL = `SELECT * FROM messages`

  try {
    console.log('🔃Getting messages from DB')

    const result = await pool.query(SQL)

    console.log('✅Complete')
    console.log('---')

    return result.rows
  } catch (err) {
    console.log('⛔Error: ', err)
    return []
  }
}

const getAllPosts = async () => {
  const SQL = `
  SELECT title, message, username 
  FROM messages AS M 
  INNER JOIN users AS U
  ON M.user_id = U.id
  `

  try {
    console.log('🔃Getting posts from DB')

    const result = await pool.query(SQL)

    console.log('✅Complete')
    console.log('---')

    return result.rows
  } catch (err) {
    console.log('⛔Error: ', err)
    return []
  }
}

const getVip = async (id) => {
  try {
    const res = await pool.query('SELECT member FROM users WHERE id = $1', [id]);

    if (res.rows.length === 0) {
      throw new Error('User not found');
    }

    const isMember = res.rows[0].member;

    if (!isMember) {
      await pool.query(
        `UPDATE users SET member = true WHERE id = $1`,
        [id]
      );
      console.log('User upgraded to VIP');
    } else {
      console.log('User already a VIP');
    }
  } catch (err) {
    console.error('Error in getVip:', err);
    throw err;
  }
};

const deleteVip = async (id) => {
  try {
    const res = await pool.query('SELECT member FROM users WHERE id = $1', [id]);

    if (res.rows.length === 0) {
      throw new Error('User not found');
    }

    const isMember = res.rows[0].member;

    if (isMember) {
      await pool.query(
        `UPDATE users SET member = false WHERE id = $1`,
        [id]
      );
      console.log('User sell VIP');
    } else {
      console.log('User already a VIP');
    }
  } catch (err) {
    console.error('Error in getVip:', err);
    throw err;
  }
};

export default {
  postUser,
  getAllUsers,
  getUserById,
  getUserByUname,
  postMessage,
  getAllMessages,
  getAllPosts,
  getVip,
  deleteVip
}
