import mongoose from "mongoose";

const vendorApplicationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    organization: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // Org image
    fonepayQr: { type: String, required: true }, // QR image
    idDocuments: [{ type: String, required: true }], // Identity documents
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Approved", "Rejected"]
    },
    approvedVendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    } // Will be populated when approved
}, { timestamps: true });

const VendorApplication = mongoose.models.VendorApplication ||
    mongoose.model('VendorApplication', vendorApplicationSchema);

export default VendorApplication;