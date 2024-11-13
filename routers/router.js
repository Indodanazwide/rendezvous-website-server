import express from 'express'
import { deleteUserById, getUserById, login, signup, updateUserById } from '../controllers/user.controller.js'
import { createReservation, createTable, deleteReservation, deleteTable, getAllReservations, getAllTables, getReservationById, getTableById, updateReservation, updateTable } from '../controllers/reservation.controller.js'
import { cancelTakeaway, createCategory, createMenuItem, createTakeaway, deleteCategory, deleteMenuItem, getCategories, getCategoryById, getMenuItemById, getMenuItems, getTakeawayById, getTakeaways, updateCategory, updateMenuItem, updateTakeawayStatus } from '../controllers/takeaway.controller.js'
import { authorize } from '../middleware/auth.js'

const router = express.Router()

// User routes
router.post('/signup', signup);
router.post('/login', login);

router.get('/users/:id', authorize(['admin', 'staff']), getUserById);
router.put('/users/:id', authorize(['admin']), updateUserById);
router.delete('/users/:id', authorize(['admin']), deleteUserById);

// Reservation routes
router.post('/tables', authorize(['admin']), createTable);
router.get('/tables', authorize(['admin', 'staff', 'customer']), getAllTables);
router.get('/tables/:id', authorize(['admin', 'staff', 'customer']), getTableById);
router.put('/tables/:id', authorize(['admin']), updateTable);
router.delete('/tables/:id', authorize(['admin']), deleteTable);

router.post('/reservations', authorize(['customer', 'staff']), createReservation);
router.get('/reservations', authorize(['admin', 'staff']), getAllReservations);
router.get('/reservations/:id', authorize(['admin', 'staff', 'customer']), getReservationById);
router.put('/reservations/:id', authorize(['staff']), updateReservation);
router.delete('/reservations/:id', authorize(['staff']), deleteReservation);

// Takeaway routes
router.post('/category', authorize(['admin']), createCategory);
router.get('/category', authorize(['admin', 'staff', 'customer']), getCategories);
router.get('/category/:id', authorize(['admin', 'staff', 'customer']), getCategoryById);
router.put('/category/:id', authorize(['admin']), updateCategory);
router.delete('/category/:id', authorize(['admin']), deleteCategory);

router.post('/menu-item', authorize(['admin']), createMenuItem);
router.get('/menu-item', authorize(['admin', 'staff', 'customer']), getMenuItems);
router.get('/menu-item/:id', authorize(['admin', 'staff', 'customer']), getMenuItemById);
router.put('/menu-item/:id', authorize(['admin']), updateMenuItem);
router.delete('/menu-item/:id', authorize(['admin']), deleteMenuItem);

router.post('/takeaway', authorize(['customer']), createTakeaway);
router.get('/takeaway', authorize(['admin', 'staff', 'customer']), getTakeaways);
router.get('/takeaway/:id', authorize(['admin', 'staff', 'customer']), getTakeawayById);
router.put('/takeaway/:id/status', authorize(['staff']), updateTakeawayStatus);
router.delete('/takeaway/:id/cancel', authorize(['customer', 'staff']), cancelTakeaway);


export default router