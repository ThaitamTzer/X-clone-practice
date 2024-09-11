import { Request, Response } from 'express'
import User from '../models/user'
import bcrypt from 'bcryptjs'
import generateTokenAndCookie, { generateToken } from '../../lib/utils/generateToken'
import generateCode from '../../lib/utils/generateDigit'
import sendEmail from '../../lib/utils/sendEmail'
const HOST = process.env.HOST || 'http://localhost:5000'

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { account, password } = req.body

      const user = await User.findOne({
        $or: [{ email: account }, { userName: account }]
      })
      const isPasswordCorrect = await bcrypt.compare(password, user?.password || '')

      if (!user || !isPasswordCorrect) {
        return res.status(400).json({ error: 'Invalid credentials' })
      }

      generateTokenAndCookie(res, user._id.toString())
      user.refreshToken = res.locals.refreshToken

      await user.save()

      res.status(200).json({
        message: 'User logged in successfully',
        jwt: res.locals.jwt,
        user: {
          id: user._id,
          userName: user.userName,
          fullName: user.fullName,
          email: user.email,
          followers: user.followers,
          following: user.following,
          avatar: user.avatar,
          coverImg: user.coverImg
        }
      })
    } catch (error: any) {
      console.log('Error in login controller: ', error.message)
      res.status(500).json({ error: error.message })
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, userName, fullName } = req.body

      if (!email || !password || !userName || !fullName) {
        return res.status(400).json({ error: 'All fields are required' })
      }

      const emailRegex = /\S+@\S+\.\S+/
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' })
      }

      const existUser = await User.findOne({ userName })
      if (existUser) {
        return res.status(400).json({ error: 'This username is already taken' })
      }

      const existEmail = await User.findOne({ email })
      if (existEmail) {
        return res.status(400).json({ error: 'This email is already taken' })
      }

      // Password validation must have at least one number, one lowercase and one uppercase letter, one special character and must be between 6 and 30 characters
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,30}$/
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          error:
            'Password must have at least one number, one lowercase and one uppercase letter, one special character and must be between 6 and 30 characters'
        })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const newUser = new User({
        userName,
        fullName,
        email,
        password: hashedPassword
      })

      if (newUser) {
        await newUser.save()
        res.status(201).json({
          message: 'User created successfully',
          user: {
            id: newUser._id,
            userName: newUser.userName,
            fullName: newUser.fullName,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            avatar: newUser.avatar,
            coverImg: newUser.coverImg
          }
        })
      } else {
        res.status(400).json({ error: 'Failed to create user' })
      }
    } catch (error: any) {
      console.log('Error in register controller: ', error.message)
      res.status(500).json({ error: error.message })
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies
      console.log(refreshToken)
      if (!refreshToken) {
        return res.status(403).json({ error: 'Refresh token not found' })
      }
      const user = await User.findOne({ refreshToken })
      if (!user) {
        return res.status(403).json({ error: 'User not authenticated' })
      }

      generateTokenAndCookie(res, user._id.toString())
      user.refreshToken = res.locals.refreshToken

      await user.save()
      res.status(200).json({
        message: 'Token refreshed successfully',
        jwt: res.locals.jwt,
        refreshToken: user.refreshToken
      })
    } catch (error: any) {
      console.log('Error in refreshToken controller: ', error.message)
      res.status(500).json({ error: error.message })
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken, jwt } = req.cookies
      if (!refreshToken || !jwt) {
        return res.status(403).json({ error: 'Refresh token not found' })
      }
      res.cookie('jwt', '', { maxAge: 0 })
      res.cookie('refreshToken', '', { maxAge: 0 })
      res.status(200).json({ message: 'User logged out successfully' })
    } catch (error: any) {
      console.log('Error in logout controller: ', error.message)
      res.status(500).json({ error: error.message })
    }
  }

  forgot = async (req: Request, res: Response) => {
    const { email } = req.body
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ error: 'Email not found' })
      }

      const resetToken = generateToken(user._id.toString())
      const resetTokenExpire = Date.now() + 600000 // 10 minutes

      user.resetToken = resetToken
      user.resetTokenExpire = resetTokenExpire

      await user.save()

      const resetUrl = `${HOST}/reset-password/${resetToken}`
      const message = `Click <a href="${resetUrl}">here</a> to reset your password`

      await sendEmail(email, 'Password reset', message)

      res.status(200).json({ message: 'Password reset link sent to your email' })
    } catch (error: any) {
      console.log('Error in forgotPassword controller: ', error.message)
      res.status(500).json({ error: error.message })
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { token } = req.params
    const { newPassword } = req.body

    try {
      const user = await User.findOne({ resetToken: token })
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired token' })
      }

      const tokenExpired = Date.now() > user.resetTokenExpire
      if (tokenExpired) {
        return res.status(400).json({ error: 'Token expired' })
      }

      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,30}$/
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          error:
            'Password must have at least one number, one lowercase and one uppercase letter, one special character and must be between 6 and 30 characters'
        })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)

      user.password = hashedPassword
      user.resetToken = ''
      user.resetTokenExpire = 0

      await user.save()
      res.status(200).json({ message: 'Password reset successfully' })
    } catch (error: any) {
      console.log('Error in resetPassword controller: ', error.message)
      res.status(500).json({ error: error.message })
    }
  }

  async changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body
    try {
      const user = await User.findById(req.body.userId)
      if (!user) {
        return res.status(400).json({ error: 'User not found' })
      }

      const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password)
      if (!isPasswordCorrect) {
        return res.status(400).json({ error: 'Invalid old password' })
      }

      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,30}$/

      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          error:
            'Password must have at least one number, one lowercase and one uppercase letter, one special character and must be between 6 and 30 characters'
        })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)

      user.password = hashedPassword

      await user.save()
      res.status(200).json({ message: 'Password changed successfully' })
    } catch (error: any) {
      console.log('Error in changePassword controller: ', error.message)
      res.status(500).json({ error: error.message })
    }
  }
}

export default new AuthController()
