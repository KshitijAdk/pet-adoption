import express from 'express';
import userAuth from '../middlewares/userAuth.js';
import { getAllUsers, getUserData, deleteUser } from '../controllers/userController.js';

const userRouter = express.Router()

userRouter.get('/data', userAuth, getUserData)
userRouter.get('/', getAllUsers)
userRouter.delete("/delete-user", deleteUser);


export default userRouter;