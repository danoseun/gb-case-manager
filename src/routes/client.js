import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth';
import { clientController } from '../controllers/client';


const { addClient, getAllClients
 } = clientController;

export const clientRouter = express.Router();


//admin routes
clientRouter.post('/clients', verifyToken, verifyAdmin, addClient);
clientRouter.get('/clients', verifyToken, verifyAdmin, getAllClients);

