import { Router } from 'express';
import {
  analyzeReportEndpoint,
  detectDuplicatesEndpoint,
  matchResearchersEndpoint,
  translateEndpoint
} from '../controllers/aiController.js';

const router = Router();

router.post('/analyze-report', analyzeReportEndpoint);
router.post('/detect-duplicates', detectDuplicatesEndpoint);
router.post('/match-researchers', matchResearchersEndpoint);
router.post('/translate', translateEndpoint);

export default router;
