import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  status: { type: String, enum: ['Available', 'Adopted', 'Pending'], default: 'Available' },
  image: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const adoptionRequestSchema = new mongoose.Schema({
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  applicantContact: { type: String, required: true },
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
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
  adoptionRequests: [adoptionRequestSchema], // Array of adoption requests
}, { timestamps: true }); // This adds createdAt and updatedAt automatically

const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);

export default Vendor;