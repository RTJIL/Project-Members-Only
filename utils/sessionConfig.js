import 'dotenv/config'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import bcrypt from 'bcrypt'
import db from '../models/queries.js'
import { pool } from '../db/db.js'

const PgSession = connectPgSimple(session)

const setupSession = (app) => {
  /*   if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
  } */

  // 1️⃣ Set up session middleware WITH PostgreSQL store
  app.use(
    session({
      store: new PgSession({
        pool: pool,
        tableName: 'session',
      }),
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        secure: process.env.NODE_ENV === 'production', // only secure in production
        sameSite: 'lax',
      },
    })
  )

  // 2️⃣ Init passport
  app.use(passport.initialize()) // may work without this line
  app.use(passport.session())

  // 3️⃣ Expose/show auth + member info to ejs
  app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.isAuthenticated = req.isAuthenticated?.() || false
    res.locals.member = req.user?.member || false
    next()
  })

  // 4️⃣ Passport Local Strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await db.getUserByUname(username)
        if (!user) return done(null, false, { message: 'User not found' })

        const match = await bcrypt.compare(password, user.password)
        if (!match) return done(null, false, { message: 'Incorrect password' })

        return done(null, user)
      } catch (err) {
        return done(err)
      }
    })
  )

  // 5️⃣ Serialize user (saves ID in session cookies)
  passport.serializeUser((user, done) => {
    console.log('Serialized user:', user)
    done(null, user.id)
  })

  // 6️⃣ Deserialize (fetch full user by ID from DB when tripping wihin site)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.getUserById(id)
      console.log('Deserialized user:', user)
      done(null, user)
    } catch (err) {
      done(err)
    }
  })
}

export default setupSession
