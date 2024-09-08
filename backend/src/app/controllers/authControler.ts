import { Request, Response } from 'express'

class AuthController {
  login(req: Request, res: Response) {
    res.json('Login page')
  }

  register(req: Request, res: Response) {
    res.json('Register page')
  }

  logout(req: Request, res: Response) {
    res.json('Logout page')
  }

  forgot(req: Request, res: Response) {
    res.json('Forgot page')
  }

  reset(req: Request, res: Response) {
    res.json('Reset page')
  }
}

export default new AuthController()
