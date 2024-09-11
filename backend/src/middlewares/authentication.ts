import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../app/models/user' // Adjust the import according to your project structure

declare global {
  namespace Express {
    interface Request {
      user?: any
      extraString?: String
    }
  }
}

const authentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt
    if (!token) {
      return res.status(403).json({ error: 'User not authenticated' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

    if (!decoded) {
      return res.status(403).json({ error: 'User not authenticated' })
    }
    console.log(decoded)

    const user = await User.findById((decoded as any).id).select('-password')
    console.log(user)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    req.user = user
    next()
  } catch (error: any) {
    console.log('Error in authentication middleware: ', error.message)
    res.status(500).json({ error: error.message })
  }
}

export default authentication
