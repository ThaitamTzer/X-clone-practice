import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db/main'

import router from './routes'

dotenv.config()
const app = express()

const port = process.env.PORT || 5000

router(app)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
  connectDB()
})
