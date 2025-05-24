// pet.model.js
import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String, required: true },
    size: { type: String, required: true },
    age: { type: Number, required: true, min: 0 },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    weight: { type: Number, required: true, min: 0 },
    health: { type: String, enum: ['Vaccinated', 'Not Vaccinated'], required: true },
    goodWith: [{ type: String, enum: ['Children', 'Other Dogs', 'Cats'] }],
    traits: [{ type: String, enum: ['Playful', 'Intelligent', 'Friendly', 'Calm'] }],
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Available', 'Adopted', 'Pending'], default: 'Available' },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    isLocked: { type: Boolean, default: false },
    lockReason: { type: String, default: null }, // New field for locking reason
    createdAt: { type: Date, default: Date.now },

});

const Pet = mongoose.models.Pet || mongoose.model('Pet', petSchema);
export default Pet;