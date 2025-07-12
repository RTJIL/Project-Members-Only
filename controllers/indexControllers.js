import db from '../models/queries.js'
import bcrypt from 'bcrypt'
import passport from 'passport'

const getHomePage = (req, res) => {
  res.render('pages/home', { title: 'Home', user: req.user })
}

const getSigninPage = (req, res) => {
  res.render('pages/forms/sign-in')
}

const postSignin = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/sign-in',
})

const getSignupPage = (req, res) => {
  res.render('pages/forms/sign-up')
}

const postSignup = async (req, res, next) => {
  console.log(req.body)
  const { username, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  console.log('After hashing: ', hashedPassword, ' Before hashing: ', password)
  try {
    await db.postUser(username, hashedPassword)
    res.redirect('/')
  } catch (err) {
    console.error(err)
    return next(err)
  }
}

const getAddMessagePage = (req, res) => {
  res.render('pages/forms/add-message')
}

export default {
  getHomePage,
  getSigninPage,
  postSignin,
  getSignupPage,
  postSignup,
  getAddMessagePage,
}
