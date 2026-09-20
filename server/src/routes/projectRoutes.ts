import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  addProjectMilestone,
  updateMilestone,
  submitProjectSolution,
  verifyProject
} from '../controllers/projectController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/', authenticateToken, createProject);
router.get('/', authenticateToken, getProjects);
router.get('/:id', authenticateToken, getProjectById);
router.post('/:id/milestones', authenticateToken, upload.array('evidence', 5), addProjectMilestone);
router.patch('/:id/milestones/:milestoneId', authenticateToken, requireRole(['EVALUATOR', 'ADMIN']), updateMilestone);
router.post('/:id/submit', authenticateToken, submitProjectSolution);
router.post('/:id/verify', authenticateToken, requireRole(['EVALUATOR', 'ADMIN']), verifyProject);

export default router;
