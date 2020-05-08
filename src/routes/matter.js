import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth';
import { matterController } from '../controllers/matter';


const { addMatter, getMatter, getMatters, updateMatter
 } = matterController;

export const matterRouter = express.Router();


//admin routes
matterRouter.post('/matters', verifyToken, verifyAdmin, addMatter);
matterRouter.get('/matters/:id', verifyToken, verifyAdmin, getMatter);
matterRouter.get('/matters', verifyToken, verifyAdmin, getMatters);
matterRouter.put('/matters/:id', verifyToken, verifyAdmin, updateMatter);

