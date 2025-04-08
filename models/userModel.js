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
    description: { type: String, default: "" },
    address: { type: String, default: "" },
    image: { type: String, default: "https://res.cloudinary.com/dxigipf0k/image/upload/v1741190518/wy6ytirqcswljhf3c13v.png" },
    adoptedPets: [{ type: mongoose.Schema.Types.ObjectId }],  // Array of adopted pet IDs
    favoritePets: [{ type: mongoose.Schema.Types.ObjectId }],  // Array of favorite pet IDs
    applications: [{
        adoptionId: { type: String, required: true },
        petId: { type: mongoose.Schema.Types.ObjectId, required: true }
    }], // Array to store adoption applications
});

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;
