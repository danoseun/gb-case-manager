import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth';
import { taskController } from '../controllers/task';




const { addTask, getAllTasks, changeTaskStatus, getTask } = taskController;

export const taskRouter = express.Router();



taskRouter.post('/matters/:matterId/tasks', verifyToken, addTask);
taskRouter.get('/tasks', verifyToken, getAllTasks);
taskRouter.put('/tasks/:id', verifyToken, changeTaskStatus);
taskRouter.get('/tasks/:id', verifyToken, getTask);



