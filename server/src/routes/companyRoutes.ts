import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { getCompanyDashboard, createCompanyOffer, requestParticipation } from '../controllers/companyController.js';
const router=Router();
router.use(authenticateToken, requireRole(['COMPANY']));
router.get('/dashboard', getCompanyDashboard);
router.post('/offers', createCompanyOffer);
router.post('/participations', requestParticipation);
export default router;
