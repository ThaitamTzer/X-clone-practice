import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Response } from 'express'

const generateTokenAndCookie = (res: Response, id: string) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })

  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
  })

  res.cookie('jwt', token, {
    maxAge: 5 * 60 * 60 * 1000, // 5 housers
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development'
  })

  res.cookie('refreshToken', refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development'
  })

  res.locals.jwt = token
  res.locals.refreshToken = refreshToken
}

export const generateToken = (id: string) => {
  return crypto.randomBytes(20).toString('hex')
}

export default generateTokenAndCookie
