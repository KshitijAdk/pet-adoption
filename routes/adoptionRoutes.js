import express from 'express';
import {
    submitAdoptionRequest,
    approveAdoptionRequest,
    rejectAdoptionRequest,
    getAdoptedPets,
    getVendorAdoptionRequests,
    getUserApplications,
    getAllAdoptionRequests,
} from '../controllers/adoptionController.js';

const router = express.Router();

// Submit a new adoption request
router.post('/apply', submitAdoptionRequest);

// Approve an adoption request
router.post('/approve', approveAdoptionRequest);

// Reject an adoption request
router.post('/reject', rejectAdoptionRequest);

// Get all adopted pets for a user
router.get('/adopted/:userId', getAdoptedPets); // 🆕 changed route from "/:userId" to clearer "/adopted/:userId"

// Get all adoption requests for a vendor
router.get('/vendor/:vendorId', getVendorAdoptionRequests); // 🆕 added vendor route

// Get all adoption applications submitted by a user
router.get('/user/:userId', getUserApplications); // 🆕 added user applications route

router.get('/adoption-requests',getAllAdoptionRequests); // 🆕 added route to get all adoption requests

export default router;
