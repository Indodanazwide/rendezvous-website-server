import express from 'express'
import { deleteUserById, getUserById, login, signup, updateUserById } from '../controllers/user.controller.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.get('/users/:id', getUserById)
router.put('/users/:id', updateUserById)
router.delete('/users/:id', deleteUserById)

export default router