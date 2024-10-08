import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db'
import setupSwagger from './config/swagger'
import cookieParser from 'cookie-parser'
import router from './routes'

dotenv.config()
const app = express()

const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api', router)
setupSwagger(app)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
  console.log(`API documentation is running on http://localhost:${port}/`)
  connectDB()
})
