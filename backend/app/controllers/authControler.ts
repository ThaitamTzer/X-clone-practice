import { Request, Response } from 'express'

class AuthController {
  login(req: Request, res: Response) {
    res.send('Login page')
  }

  register(req: Request, res: Response) {
    res.send('Register page')
  }

  logout(req: Request, res: Response) {
    res.send('Logout page')
  }

  forgot(req: Request, res: Response) {
    res.send('Forgot page')
  }

  reset(req: Request, res: Response) {
    res.send('Reset page')
  }
}

export default new AuthController()
