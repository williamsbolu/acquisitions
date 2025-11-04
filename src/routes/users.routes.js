import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '#controllers/users.controller.js';
import { authenticate, requireRole } from '#middleware/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all user routes
router.use(authenticate);

// Admin only routes
router.get('/', requireRole('admin'), getAllUsers);
router.delete('/:id', requireRole(['user', 'admin']), deleteUser); // Users can delete their own account, admins can delete any

// Authenticated user routes
router.get('/:id', getUserById);
router.put('/:id', updateUser);

export default router;
