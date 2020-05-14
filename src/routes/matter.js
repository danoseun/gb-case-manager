import express from 'express';
import fileUpload from 'express-fileupload';
import { verifyToken, verifyAdmin } from '../middleware/auth';
import { matterController } from '../controllers/matter';
//import { multerUploads } from '../helpers/multer';


const { addMatter, getMatter, getMatters, updateMatter, deleteMatter,
    uploadMatterResources, getMatterResources, deleteMatterResource
 } = matterController;

export const matterRouter = express.Router();


//admin routes
matterRouter.post('/matters', verifyToken, verifyAdmin, addMatter);
matterRouter.get('/matters/:id', verifyToken, getMatter);
matterRouter.get('/matters', verifyToken, getMatters);
matterRouter.put('/matters/:id', verifyToken, verifyAdmin, updateMatter);
matterRouter.delete('/matters/:id', verifyToken, verifyAdmin, deleteMatter);
matterRouter.post('/matters/:id/uploads', verifyToken, verifyAdmin, fileUpload({useTempFiles: true}), uploadMatterResources);
matterRouter.get('/matters/:id/uploads', verifyToken, getMatterResources);
matterRouter.delete('/matters/:id/uploads/:public_id', verifyToken, verifyAdmin, deleteMatterResource);

