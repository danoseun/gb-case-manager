import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth';
import { taskController } from '../controllers/task';




const { addTask, getAllTasks } = taskController;

export const taskRouter = express.Router();



taskRouter.post('/matters/:matterId/tasks', verifyToken, addTask);
taskRouter.get('/tasks', verifyToken, getAllTasks);


