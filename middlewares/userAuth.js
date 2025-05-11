import jwt from "jsonwebtoken"
import User from "../models/userModel.js";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again' });
    }

    try {
        // console.log('Token:', token);  // Log the token to verify it's coming correctly

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(tokenDecode.id).select('-password -__v -createdAt -updatedAt');
        if (!user) {
            return res.json({ success: false, message: 'User not found. Login Again' });
        }  
        req.user = user; // Attach user to request object

        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id;
        } else {
            return res.json({ success: false, message: 'Not Authorized. Login Again' });
        }

        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export default userAuth;