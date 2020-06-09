import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth';
import { eventController } from '../controllers/event';


const { addEvent, updateEvent, viewAllEvents } = eventController;

export const eventRouter = express.Router();


//admin routes
eventRouter.post('/events', verifyToken, verifyAdmin, addEvent);
eventRouter.put('/events/:id', verifyToken, verifyAdmin, updateEvent);
eventRouter.get('/events', verifyToken, viewAllEvents);

