import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth';
import { updateValidator } from '../validations/update';
import { updateController } from '../controllers/update';
//import { multerUploads } from '../helpers/multer';


const { addUpdateValidator } = updateValidator;
const { addUpdate, getMatterUpdates, getMatters, updateMatter, deleteMatter,
    uploadMatterResources, getMatterResources, deleteMatterResource
 } = updateController;

export const updateRouter = express.Router();


//admin routes


updateRouter.post('/matters/:matterId/updates', verifyToken, addUpdateValidator, addUpdate);
updateRouter.get('/matters/:matterId/updates', verifyToken, getMatterUpdates)
//matterRouter.get('/matters/:id/uploads', verifyToken, getMatterResources);
//matterRouter.delete('/matters/:id/uploads/:public_id', verifyToken, verifyAdmin, deleteMatterResource);

