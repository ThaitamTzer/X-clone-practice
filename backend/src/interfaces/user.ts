import { Document } from 'mongoose'

interface IUser extends Document {
  userName: string
  fullName: string
  email: string
  password: string
  followers: number
  following: number
  avatar: string
  coverImg: string
  refreshToken: string
}
