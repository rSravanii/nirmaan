import { Router } from 'express';
import {
  createProblemReport,
  getProblems,
  getProblemById,
  verifyProblem,
  claimProblem,
  getProblemMatches
} from '../controllers/problemController.js';
import { authenticateToken, optionalAuth, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/', optionalAuth, upload.array('photos', 5), createProblemReport);
router.get('/', getProblems);
router.get('/:id', optionalAuth, getProblemById);
router.post('/:id/verify', authenticateToken, requireRole(['EVALUATOR', 'ADMIN']), verifyProblem);
router.post('/:id/claim', authenticateToken, requireRole(['STUDENT', 'PROFESSOR', 'ADMIN']), claimProblem);
router.get('/:id/matches', getProblemMatches);

export default router;
