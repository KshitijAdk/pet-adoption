// routes/vendorRoutes.js
import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js'; // Import Cloudinary storage
import { getAllVendors, registerVendor } from '../controllers/vendorController.js';

const router = express.Router();
const upload = multer({ storage }); // Use Cloudinary storage for multer

// Vendor registration route (POST)
router.post('/register', upload.single('image'), registerVendor); // Handle single file upload
router.get('/all-vendors', getAllVendors);

export default router;