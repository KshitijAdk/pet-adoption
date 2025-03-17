import express from 'express';
import { getUserFavoritePets } from '../controllers/favoriteController.js';

const router = express.Router();

// Get favorite pets of a user
router.get('/:userId', getUserFavoritePets);

export default router;
