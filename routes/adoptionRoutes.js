import express from 'express';
import { submitAdoptionRequest, approveAdoptionRequest, rejectAdoptionRequest, getAdoptedPets } from '../controllers/adoptionController.js';

const router = express.Router();

router.post('/apply', submitAdoptionRequest);
router.post('/approve', approveAdoptionRequest);
router.post('/reject', rejectAdoptionRequest);
router.get('/:userId', getAdoptedPets);


export default router;
