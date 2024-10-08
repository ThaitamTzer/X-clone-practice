import { Document, ObjectId } from 'mongoose'

export interface IUser {
  userName: string
  fullName: string
  email: string
  password: string
  createdPassword?: string
  resetToken?: string
  resetTokenExpire?: number
  followers: ObjectId[] // Refers to other users by their ObjectId
  following: ObjectId[] // Refers to other users by their ObjectId
  avatar?: string
  coverImg?: string
  bio?: string
  link?: string
  refreshToken?: string
}
