import { Router } from 'express';
import { getProjectActivity, addProjectComment } from '../controllers/collaborationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/:id/activity', authenticateToken, getProjectActivity);
router.post('/:id/comments', authenticateToken, addProjectComment);

export default router;
