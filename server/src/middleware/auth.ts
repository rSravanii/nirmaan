import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types/index.js';
import { User, IUser } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: IUser;
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-only-nirmaan-secret-change-me';
    const decoded = jwt.verify(token, secret) as { userId: string; email: string; role: UserRole };
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid token. User no longer exists.' });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
    return;
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        message: `Access forbidden: Requires one of [${allowedRoles.join(', ')}]. Current role: ${req.user.role}` 
      });
      return;
    }

    next();
  };
}

export async function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-only-nirmaan-secret-change-me';
    const decoded = jwt.verify(token, secret) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (user) {
      req.user = user;
    }
  } catch (e) {
    // Ignore invalid optional tokens
  }
  next();
}
