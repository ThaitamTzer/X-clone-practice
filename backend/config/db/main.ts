import mongoose from 'mongoose'

const mongodbURL = process.env.MONGODB_URL || 'mongodb://localhost:27017/x'

export default async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/express-mongo')
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}
