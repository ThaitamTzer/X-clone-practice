import { Router } from 'express'
import authControler from '../app/controllers/authControler'

const router = Router()

router.post('/login', authControler.login)
router.post('/register', authControler.register)
router.post('/logout', authControler.logout)
router.post('/forgot', authControler.forgot)
router.post('/reset/:token', authControler.resetPassword)
router.post('/refresh-token', authControler.refreshToken)

export default router
