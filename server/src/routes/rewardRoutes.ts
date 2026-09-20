import { Router } from 'express';
import { getLeaderboard, getMyRewards } from '../controllers/rewardsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/leaderboard', getLeaderboard);
router.get('/me', authenticateToken, getMyRewards);

export default router;
