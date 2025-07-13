import db from '../models/queries.js'
import bcrypt from 'bcrypt'
import passport from 'passport'
import { validationResult } from 'express-validator'
import { validateSignIn, validateSignUp } from '../utils/validations.js'

const getHomePage = async (req, res) => {
  const posts = await db.getAllPosts()

  console.log('user info: ', req.user)
  console.log('---')

  res.render('pages/home', { user: req.user, posts: posts })
}

const getSigninPage = (req, res) => {
  res.render('pages/forms/sign-in')
}

const postSignin = [
  validateSignIn,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).render('pages/forms/sign-in', {
        errors: errors.array(),
      })
    }
    next()
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign-in',
  }),
]

const getSignupPage = (req, res) => {
  res.render('pages/forms/sign-up')
}

const postSignup = [
  validateSignUp,
  async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).render('pages/forms/sign-up', {
        errors: errors.array(),
      })
    }

    console.log(req.body)
    const { username, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(
      'After hashing: ',
      hashedPassword,
      ' Before hashing: ',
      password
    )
    try {
      await db.postUser(username, hashedPassword)
      res.redirect('/')
    } catch (err) {
      console.error(err)
      return next(err)
    }
  },
]

const getAddMessagePage = (req, res) => {
  res.render('pages/forms/add-message')
}

const postMessage = async (req, res) => {
  const user_id = req.user.id
  const { title, message } = req.body

  try {
    await db.postMessage(title, message, user_id)
    res.redirect('/')
  } catch (err) {
    console.error(err)
    res.status(500).send('Something went wrong')
  }
}

const getVip = async (req, res) => {
  try {
    const userId = req.user.id

    await db.getVip(userId)

    res.redirect('/')
  } catch (err) {
    console.error('Error upgrading to VIP:', err)
    res.status(500).send('Something went wrong upgrading to VIP')
  }
}

const deleteVip = async (req, res) => {
  try {
    const userId = req.user.id

    await db.deleteVip(userId)

    res.redirect('/')
  } catch (err) {
    console.error('Error upgrading to VIP:', err)
    res.status(500).send('Something went wrong upgrading to VIP')
  }
}

const getNotFound = async (req, res) => {
  res.status(404).render('pages/404')
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

export default {
  getHomePage,
  getSigninPage,
  postSignin,
  getSignupPage,
  postSignup,
  getAddMessagePage,
  checkAuthenticated,
  checkNotAuthenticated,
  postMessage,
  getVip,
  deleteVip,
  getNotFound,
}
