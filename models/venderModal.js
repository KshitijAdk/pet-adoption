import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    organization: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, default: "pending", enum: ["pending", "approved", "rejected"] }, // Added status field
});

const Vendor = mongoose.models.Vendor || mongoose.model('VendorApply', vendorSchema);

export default Vendor;
