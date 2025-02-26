import express from 'express';
import userAuth from '../middlewares/userAuth.js';
import { getAllUsers, getUserData } from '../controllers/userController.js';

const userRouter = express.Router()

userRouter.get('/data', userAuth, getUserData)
userRouter.get('/', getAllUsers)

export default userRouter;