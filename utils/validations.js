import { body } from "express-validator"
import db from '../models/queries.js'
import bcrypt from 'bcrypt'

const alphaErr = 'must contain at least one num and one capital letter: q1W'
const lengthErr = 'must be between 1 and 20 characters.'

export const validateSignUp = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 1, max: 20 })
    .withMessage(`Username ${lengthErr}`)
    .custom(async (value) => {
      const existingUser = await db.getUserByUname(value)
      if (existingUser) throw new Error('Username already taken')
      return true
    }),
  body('password')
    .trim()
    .matches(/^(?=.*[A-Z])(?=.*\d)/)
    .withMessage(`Password ${alphaErr}`)
    .isLength({ min: 1, max: 20 })
    .withMessage(`Password ${lengthErr}`),
]

export const validateSignIn = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 1, max: 20 })
    .withMessage(`Username ${lengthErr}`)
    .custom(async (value, { req }) => {
      const existingUser = await db.getUserByUname(value)
      if (!existingUser) {
        throw new Error('Username does not exist')
      }
      // Attach user to req for password check later
      req.userFromValidation = existingUser
      return true
    }),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .custom(async (value, { req }) => {
      const user = req.userFromValidation
      if (!user) return true // avoid throwing if username already failed

      const isMatch = await bcrypt.compare(value, user.password)
      if (!isMatch) throw new Error('Incorrect password')

      return true
    }),
]