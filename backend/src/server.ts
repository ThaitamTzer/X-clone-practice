import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db'
import setupSwagger from './config/swagger'

import router from './routes'
import authRoute from './routes/auth'

dotenv.config()
const app = express()

const port = process.env.PORT || 5000

app.use(express.json())

app.use('/api/auth', authRoute)
setupSwagger(app)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
  console.log(`API documentation is running on http://localhost:${port}/api-docs`)
  connectDB()
})
