import express from 'express';
import userAuth from '../middlewares/userAuth.js';
import { getAllUsers, getUserData, deleteUser, updateProfileImage, updateProfileAndVendor, changePassword, banUser, unbanUser, getAllAdmins, createAdmin } from '../controllers/userController.js';

const userRouter = express.Router()

userRouter.get('/data', userAuth, getUserData)
userRouter.get('/', getAllUsers)
userRouter.delete("/delete-user", deleteUser);
userRouter.put("/update-profile-img", updateProfileImage);
userRouter.put("/edit/profile", updateProfileAndVendor);
userRouter.post("/change-password", userAuth, changePassword);

userRouter.put("/ban", banUser);
userRouter.put("/unban", unbanUser);
userRouter.get("/admins", getAllAdmins);
userRouter.post("/create-admin", createAdmin);

export default userRouter;