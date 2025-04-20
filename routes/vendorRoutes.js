// routes/vendorRoutes.js
import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js'; // Import Cloudinary storage
import { registerVendor, approveVendor, rejectVendor, getPendingVendors, getAllVendorApplications, getAllVendors, getVendorById } from '../controllers/vendorController.js';

const router = express.Router();
const upload = multer({ storage }); // Use Cloudinary storage for multer

// Accept one 'image' file and multiple 'idDocuments'
router.post('/register', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'fonepayQr', maxCount: 1 },
    { name: 'idDocuments', maxCount: 5 },
]), registerVendor);

router.get('/all-vendor-applications', getAllVendorApplications);
router.put('/approve-vendor/:vendorId', approveVendor);
router.put('/reject-vendor/:vendorId', rejectVendor); // New route for rejecting a vendor
router.get('/pending-vendors', getPendingVendors);
router.get('/all-vendors', getAllVendors)
router.get('/:vendorId', getVendorById)


export default router;