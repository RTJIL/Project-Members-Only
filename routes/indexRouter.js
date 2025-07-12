import { Router } from 'express'
import indexControllers from '../controllers/indexControllers.js'

const indexRouter = Router()

indexRouter.get('/', indexControllers.getHomePage)

indexRouter.get('/sign-in', indexControllers.getSigninPage)
indexRouter.post('/sign-in', indexControllers.postSignin)

indexRouter.get('/sign-up', indexControllers.getSignupPage)
indexRouter.post('/sign-up', indexControllers.postSignup)

indexRouter.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

indexRouter.get("/add-message", indexControllers.getAddMessagePage)

export default indexRouter
