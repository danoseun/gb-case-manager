import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth';
import { updateTypeValidator } from '../validations/updatetype';
import { updateTypeController } from '../controllers/updatetype';


const { addUpdateTypeValidator } = updateTypeValidator;
const { addUpdateType, getAllUpdateTypes, 
       editUpdateType, deleteUpdateType
 } = updateTypeController;

export const updateTypeRouter = express.Router();


//admin routes
updateTypeRouter.post('/updatetypes', verifyToken, verifyAdmin, addUpdateTypeValidator, addUpdateType);
updateTypeRouter.get('/updatetypes', verifyToken, verifyAdmin, getAllUpdateTypes);
updateTypeRouter.put('/updatetypes/:id', verifyToken, verifyAdmin, editUpdateType);
updateTypeRouter.delete('/updatetypes/:id', verifyToken, verifyAdmin, deleteUpdateType);

