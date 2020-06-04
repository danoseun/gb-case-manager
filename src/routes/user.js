import express from 'express';
import { userValidator } from '../validations/user';
import { verifyToken, verifyAdmin } from '../middleware/auth';
import { userContoller } from '../controllers/user';
import { getAllAdmins } from '../services/user';

const { addUserValidator, loginUserValidator } = userValidator;

const { addUser,loginUser,
    loginAdmin, adminVerification, 
    resetPassword, receiveNewPassword, 
    adminGetAllUsers, updateUserProfile,
    adminDeleteUser
 } = userContoller;

export const userRouter = express.Router();


userRouter.post('/login', loginUserValidator,loginUser);
userRouter.post('/forgot', resetPassword);
userRouter.patch('/password/reset/:token', receiveNewPassword);

//admin routes
userRouter.post('/admin/verify', adminVerification);
userRouter.post('/register', verifyToken, verifyAdmin, addUserValidator, addUser);
userRouter.get('/users', verifyToken, verifyAdmin, adminGetAllUsers);
userRouter.put('/users/:id', verifyToken, updateUserProfile);
userRouter.delete('/users/:id', verifyToken, verifyAdmin, adminDeleteUser);