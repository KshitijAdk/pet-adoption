import express from 'express';
import { getDashboardStats, getDetailedStats, getVendorData } from '../controllers/adminStatsController.js';

const router = express.Router()


router.get('/dashboard', getDashboardStats);
router.get('/stats', getDetailedStats);
router.get("/:vendorId", getVendorData);


export default router;