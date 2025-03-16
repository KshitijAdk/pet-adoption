import express from 'express';
import { submitAdoptionRequest } from '../controllers/adoptionController.js';

const router = express.Router();

router.post('/apply', submitAdoptionRequest);

export default router;
