import mongoose from "mongoose";

const adoptionRequestSchema = new mongoose.Schema({
  adoptionId: { type: String, required: true },
  applicantId: { type: String, required: true },  // Added applicantId
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  applicantContact: { type: String, required: true },
  applicantAddress: { type: String, required: true },
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  petName: { type: String, required: true },
  adoptionReason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});


const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String, required: true },
  size: { type: String, required: true },
  age: { type: Number, required: true, min: 0 },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  weight: { type: Number, required: true, min: 0 },
  health: { type: String, enum: ['Vaccinated', 'Not Vaccinated'], required: true },
  goodWith: [{ type: String, enum: ['Children', 'Other Dogs', 'Cats'] }], // Array of options
  traits: [{ type: String, enum: ['Playful', 'Intelligent', 'Friendly', 'Calm'] }], // Array of options
  imageUrl: { type: String, required: true }, // URL from Cloudinary
  description: { type: String, required: true },
  status: { type: String, enum: ['Available', 'Adopted', 'Pending'], default: 'Available' },
  adoptionRequests: [adoptionRequestSchema], // Array of adoption requests
  createdAt: { type: Date, default: Date.now },
});

const vendorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  organization: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: "https://res.cloudinary.com/dxigipf0k/image/upload/v1741190518/wy6ytirqcswljhf3c13v.png" },
  pets: [petSchema], // Array of pets associated with the vendor
}, { timestamps: true }); // This adds createdAt and updatedAt automatically

const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);

export default Vendor;
