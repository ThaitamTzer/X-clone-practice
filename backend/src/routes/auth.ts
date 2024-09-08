import { Router } from 'express'
import { Request, Response } from 'express'
import authControler from '../app/controllers/authControler'

const router = Router()

/**
 * @swagger
 * /api/auth/login:
 *   get:
 *     summary: Login page
 *     tags: [Authentication]  // thêm tag để dễ quản lý
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/login', authControler.login)

/**
 * @swagger
 * /api/auth/register:
 *   get:
 *     summary: Register page
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/register', authControler.register)

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout page
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/logout', authControler.logout)

/**
 * @swagger
 * /api/auth/forgot:
 *   get:
 *     summary: Forgot page
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/forgot', authControler.forgot)

/**
 * @swagger
 * /api/auth/reset:
 *   get:
 *     summary: Reset page
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/reset', authControler.reset)

export default router
