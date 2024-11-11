import express from 'express'
import { deleteUserById, getUserById, login, signup, updateUserById } from '../controllers/user.controller.js'
import { createReservation, createTable, deleteReservation, deleteTable, getAllReservations, getAllTables, getReservationById, getTableById, updateReservation, updateTable } from '../controllers/reservation.controller.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.get('/users/:id', getUserById)
router.put('/users/:id', updateUserById)
router.delete('/users/:id', deleteUserById)

router.post('/tables', createTable)
router.get('/tables', getAllTables)
router.get('/tables/:id', getTableById);
router.put('/tables/:id', updateTable)
router.delete('/tables/:id', deleteTable)

router.post('/reservations', createReservation)
router.get('/reservations', getAllReservations)
router.get('/reservations/:id', getReservationById)
router.put('/reservations/:id', updateReservation)
router.delete('/reservations/:id', deleteReservation)

export default router