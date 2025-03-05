import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Number, default: 0 },
    role: { type: String, default: 'user' },  // Role field (user or vendor or admin)
    contact: { type: String, default: "" },
    address: { type: String, default: "" },
    image: { type: String, default: "https://res.cloudinary.com/dxigipf0k/image/upload/v1741190518/wy6ytirqcswljhf3c13v.png" }
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;
