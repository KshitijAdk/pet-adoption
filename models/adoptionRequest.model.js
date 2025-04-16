// adoptionRequest.model.js

import mongoose from "mongoose";

const adoptionRequestSchema = new mongoose.Schema({
    adoptionId: { type: String, required: true, unique: true },
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    applicantImage: { type: String, required: true },
    applicantContact: { type: String, required: true },
    applicantAddress: { type: String, required: true },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    petName: { type: String, required: true },
    adoptionReason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
});

const AdoptionRequest = mongoose.models.AdoptionRequest || mongoose.model('AdoptionRequest', adoptionRequestSchema);
export default AdoptionRequest;