import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth';
import { updateTypeController } from '../controllers/updatetype';


const { addUpdateType, getAllUpdateTypes, 
       editUpdateType, deleteUpdateType
 } = updateTypeController;

export const updateTypeRouter = express.Router();


//admin routes
updateTypeRouter.post('/updatetypes', verifyToken, verifyAdmin, addUpdateType);
updateTypeRouter.get('/updatetypes', verifyToken, verifyAdmin, getAllUpdateTypes);
updateTypeRouter.put('/updatetypes/:id', verifyToken, verifyAdmin, editUpdateType);
updateTypeRouter.delete('/updatetypes/:id', verifyToken, verifyAdmin, deleteUpdateType);

