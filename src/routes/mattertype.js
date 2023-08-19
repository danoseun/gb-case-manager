import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth';
import { matterTypeValidator } from '../validations/mattertype';
import { matterTypeController } from '../controllers/mattertype';

const { addMatterTypeValidator } = matterTypeValidator;
const { addMatterType, getAllMatterTypes, editMatterType, deleteMatterType
 } = matterTypeController;

export const matterTypeRouter = express.Router();


//admin routes
matterTypeRouter.post('/mattertypes', verifyToken, verifyAdmin, addMatterTypeValidator, addMatterType);
matterTypeRouter.get('/mattertypes', verifyToken, verifyAdmin, getAllMatterTypes);
matterTypeRouter.put('/mattertypes/:id', verifyToken, verifyAdmin, editMatterType);
matterTypeRouter.delete('/mattertypes/:id', verifyToken, verifyAdmin, deleteMatterType);

