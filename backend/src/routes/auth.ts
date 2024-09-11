import { Router } from 'express'
import authControler from '../app/controllers/authControler'
import authentication from '../middlewares/authentication'

const router = Router()

router.post('/login', authControler.login)
router.post('/register', authControler.register)
router.post('/logout', authControler.logout)
router.post('/forgot', authControler.forgot)
router.get('/me', authentication, authControler.getProfile)
router.patch('/change-password', authentication, authControler.changePassword)
router.post('/reset/:token', authControler.resetPassword)
router.post('/refresh-token', authControler.refreshToken)

export default router
