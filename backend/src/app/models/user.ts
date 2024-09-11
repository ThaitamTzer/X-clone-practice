import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    createdPassword: {
      type: String
    },
    resetToken: {
      type: String,
      default: ''
    },
    resetTokenExpire: {
      type: Number,
      default: ''
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
      }
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
      }
    ],
    avatar: {
      type: String,
      default: 'https://www.gravatar.com/avatar/'
    },
    coverImg: {
      type: String,
      default: 'https://picsum.photos/1920/1080'
    },
    bio: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    refreshToken: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)

export default User
