import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth';
import { updateValidator } from '../validations/update';
import { updateController } from '../controllers/update';
//import { multerUploads } from '../helpers/multer';


const { addUpdateValidator } = updateValidator;
const { addUpdate, getMatterUpdates, addCommentToUpdate, editUpdate
 } = updateController;

export const updateRouter = express.Router();


//admin routes


updateRouter.post('/matters/:matterId/updates', verifyToken, addUpdateValidator, addUpdate);
updateRouter.get('/matters/:matterId/updates', verifyToken, getMatterUpdates)
updateRouter.post('/updates/:updateId/comments', verifyToken, addCommentToUpdate);
updateRouter.put('/updates/:updateId', verifyToken, editUpdate);

