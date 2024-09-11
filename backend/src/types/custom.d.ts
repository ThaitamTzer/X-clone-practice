type IUser = {
  _id?: string
  userName: string
  fullName: string
  email: string
  password: string
  createdPassword?: string
  resetToken?: string
  resetTokenExpire?: number
  followers: string[]
  following: string[]
  avatar?: string
  coverImg?: string
  bio?: string
  link?: string
  refreshToken?: string
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}
