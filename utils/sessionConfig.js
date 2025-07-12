import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import session from 'express-session'
import bcrypt from 'bcrypt'
import db from '../models/queries.js'

const setupSession = (app) => {
  // 1️⃣ Set up session middleware first
  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
    })
  )

  // 2️⃣ Set up passport middleware
  app.use(passport.initialize())
  app.use(passport.session()) // this adds req.user and req.isAuthenticated()

  // 3️⃣ Set up res.locals for use in EJS
  app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.isAuthenticated = req.isAuthenticated?.() || false
    next()
  })

  // 4️⃣ Passport Local Strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const users = await db.getAllUsers()
        const user = users.find((u) => u.username === username)
        if (!user) return done(null, false, { message: 'User not found' })

        const match = await bcrypt.compare(password, user.password)
        if (!match) return done(null, false, { message: 'Incorrect password' })

        return done(null, user)
      } catch (err) {
        return done(err)
      }
    })
  )

  // 5️⃣ Serialize the user — saves the user ID in the cookie
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // 6️⃣ Deserialize — gets user from the database each time using the ID
  passport.deserializeUser(async (id, done) => {
    try {
      const users = await db.getAllUsers()
      const user = users.find((u) => u.id === id)
      done(null, user)
    } catch (err) {
      done(err)
    }
  })
}

export default setupSession
