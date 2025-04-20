import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  organization: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  fonepayQr: { type: String, required: true },
  idDocuments: {
    type: [String],
    required: true,
    validate: {
      validator: function (docs) {
        return docs.length > 0; // At least one document required
      },
      message: "At least one ID document is required"
    }
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VendorApplication',
    required: true
  }
}, { timestamps: true });

const Vendor = mongoose.models.Vendor ||
  mongoose.model('Vendor', vendorSchema);

export default Vendor;