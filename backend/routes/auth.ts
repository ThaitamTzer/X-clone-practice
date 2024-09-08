import { Router } from 'express'
import authController from '../app/controllers/authControler'

const router = Router()

router.get('/login', authController.login)
router.get('/register', authController.register)
router.get('/logout', authController.logout)
router.get('/forgot', authController.forgot)
router.get('/reset', authController.reset)

export default router
