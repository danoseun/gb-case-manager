import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth';
import { matterController } from '../controllers/matter';
import { multerUploads } from '../helpers/multer';


const { addMatter, getMatter, getMatters, updateMatter, deleteMatter,
    uploadMatterResource
 } = matterController;

export const matterRouter = express.Router();


//admin routes
matterRouter.post('/matters', verifyToken, verifyAdmin, addMatter);
matterRouter.get('/matters/:id', verifyToken, getMatter);
matterRouter.get('/matters', verifyToken, getMatters);
matterRouter.put('/matters/:id', verifyToken, verifyAdmin, updateMatter);
matterRouter.delete('/matters/:id', verifyToken, verifyAdmin, deleteMatter);
// change this line later
// gifRouter.post('/gifs', verifyUserToken, multerUploads, validateGifsDetails, validateGifsSize, createAGif);
matterRouter.post('/uploads', multerUploads, uploadMatterResource);

