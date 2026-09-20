import { Router } from 'express';
import { register, login, logout, getCurrentUser, demoLogin } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/demo-login', demoLogin);
router.get('/me', authenticateToken, getCurrentUser);

export default router;
