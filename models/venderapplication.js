import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    organization: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, default: "Pending", enum: ["Pending", "Approved", "Rejected"] },
}, { timestamps: true }); // This adds createdAt and updatedAt automatically

const VendorApplication = mongoose.models.VendorApplication || mongoose.model('VendorApplication', vendorSchema);

export default VendorApplication;
