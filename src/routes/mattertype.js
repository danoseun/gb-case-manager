import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth';
import { matterTypeController } from '../controllers/mattertype';


const { addMatterType, getAllMatterTypes
 } = matterTypeController;

export const matterTypeRouter = express.Router();


//admin routes
matterTypeRouter.post('/mattertypes', verifyToken, verifyAdmin, addMatterType);
matterTypeRouter.get('/mattertypes', verifyToken, verifyAdmin, getAllMatterTypes);

