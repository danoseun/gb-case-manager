import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth';
import { matterTypeController } from '../controllers/mattertype';


const { addMatterType
 } = matterTypeController;

export const matterTypeRouter = express.Router();


//admin routes
matterTypeRouter.post('/matters', verifyToken, verifyAdmin, addMatterType);

