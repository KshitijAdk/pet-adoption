import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },  // Role field (user or vendor)
    organization: { type: String, default: "" },  // Vendor-specific fields
    contact: { type: String, default: "" },
    address: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" }
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;
