import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import expressLayouts from 'express-ejs-layouts'
import { fileURLToPath } from 'url'
import indexRouter from './routes/indexRouter.js'
import setupSession from './utils/sessionConfig.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//serve static assets
app.use(express.static(path.join(__dirname, 'public')))

//serve form data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//setting up ejs and its tamplate
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(expressLayouts)
app.set('layout', 'layout')

//setting up passport
setupSession(app)

//routes
app.use('/', indexRouter)

const PORT = process.env.PGPORT || 3000
app.listen(PORT, () => {
  console.log('Your server started on port: ', PORT)
})
