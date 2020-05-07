import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth';
import { matterController } from '../controllers/matter';


const { addMatter
 } = matterController;

export const matterRouter = express.Router();


//admin routes
matterRouter.post('/matters', verifyToken, verifyAdmin, addMatter);

