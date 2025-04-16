import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Verification and Reset OTP
    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Number, default: 0 },

    // Role and profile
    role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
    contact: { type: String, default: "" },
    description: { type: String, default: "" },
    address: { type: String, default: "" },
    image: {
        type: String,
        default: "https://res.cloudinary.com/dxigipf0k/image/upload/v1741190518/wy6ytirqcswljhf3c13v.png"
    },

    // Adopted pets
    adoptedPets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],

    // Favorite pets
    favouritePets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],

    // Adoption applications
    applications: [
        {
            adoptionId: { type: mongoose.Schema.Types.ObjectId, ref: "AdoptionRequest", required: true },
            petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
            status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
            createdAt: { type: Date, default: Date.now },
        }
    ]
}, { timestamps: true });

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
