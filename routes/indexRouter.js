import { Router } from 'express'
import indexController from '../controllers/indexController.js'

const indexRouter = Router()

indexRouter.get('/', indexController.getHomePage)

indexRouter.get(
  '/sign-in',
  indexController.checkNotAuthenticated,
  indexController.getSigninPage
)
indexRouter.post(
  '/sign-in',
  indexController.checkNotAuthenticated,
  indexController.postSignin
)

indexRouter.get(
  '/sign-up',
  indexController.checkNotAuthenticated,
  indexController.getSignupPage
)
indexRouter.post(
  '/sign-up',
  indexController.checkNotAuthenticated,
  indexController.postSignup
)

indexRouter.get('/log-out', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})

indexRouter.get(
  '/add-message',
  indexController.checkAuthenticated,
  indexController.getAddMessagePage
)

indexRouter.post(
  '/add-message',
  indexController.checkAuthenticated,
  indexController.postMessage
)

indexRouter.get(
  '/get-vip',
  indexController.checkAuthenticated,
  indexController.getVip
)

indexRouter.get(
  '/delete-vip',
  indexController.checkAuthenticated,
  indexController.deleteVip
)

indexRouter.use(indexController.getNotFound);

export default indexRouter
