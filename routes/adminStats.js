import express from 'express';
import { getDashboardStats, getDetailedStats } from '../controllers/adminStatsController.js';

const router = express.Router()


router.get('/dashboard', getDashboardStats);
router.get('/stats', getDetailedStats);


export default router;