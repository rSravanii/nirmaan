import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { getExpertDashboard } from '../controllers/expertController.js';
const router=Router();
router.get('/dashboard', authenticateToken, requireRole(['STUDENT','PROFESSOR','RESEARCHER']), getExpertDashboard);
export default router;
