import { Router } from 'express';
import authRoutes from './authRoutes.js';
import problemRoutes from './problemRoutes.js';
import aiRoutes from './aiRoutes.js';
import projectRoutes from './projectRoutes.js';
import collaborationRoutes from './collaborationRoutes.js';
import adminRoutes from './adminRoutes.js';
import rewardRoutes from './rewardRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import knowledgeRoutes from './knowledgeRoutes.js';
import expertRoutes from './expertRoutes.js';
import companyRoutes from './companyRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/problems', problemRoutes);
router.use('/ai', aiRoutes);
router.use('/projects', projectRoutes);
router.use('/projects', collaborationRoutes);
router.use('/admin', adminRoutes);
router.use('/rewards', rewardRoutes);
router.use('/notifications', notificationRoutes);
router.use('/knowledge', knowledgeRoutes);
router.use('/experts', expertRoutes);
router.use('/companies', companyRoutes);

export default router;
