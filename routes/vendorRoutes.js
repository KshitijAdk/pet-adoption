// routes/vendorRoutes.js
import express from 'express';
import { upload } from '../config/cloudinary.js';
import { registerVendor, approveVendor, rejectVendor, getPendingVendors, getAllVendorApplications, getAllVendors, getVendorById } from '../controllers/vendorController.js';

const router = express.Router();

router.post('/register', registerVendor);

router.get('/all-vendor-applications', getAllVendorApplications);
router.put('/approve-vendor/:vendorId', approveVendor);
router.put('/reject-vendor/:vendorId', rejectVendor); // New route for rejecting a vendor
router.get('/pending-vendors', getPendingVendors);
router.get('/all-vendors', getAllVendors)
router.get('/:vendorId', getVendorById)


export default router;