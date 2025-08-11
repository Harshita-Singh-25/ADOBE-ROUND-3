import express from 'express';
import { uploadPdf, getRelated, getInsights, getPodcast } from '../services/pdfProcessing.js';

const router = express.Router();

router.post('/upload', uploadPdf);
router.get('/related', getRelated);
router.get('/insights', getInsights);
router.post('/podcast', getPodcast);

export default router;
