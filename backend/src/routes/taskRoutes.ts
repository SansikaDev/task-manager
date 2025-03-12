import express from 'express';
import {
  getTasks,
  createTask,
  getTask,
  deleteTask,
  updateTask,
} from '../controllers/taskController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createTask); // Create a task
router.get('/', authMiddleware, getTasks); // Get all tasks
router.get('/:id', authMiddleware, getTask); // Get single task
router.put('/:id', authMiddleware, updateTask); // Update task
router.delete('/:id', authMiddleware, deleteTask); // Delete task

export default router;
