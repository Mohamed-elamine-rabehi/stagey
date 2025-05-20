import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ExpressError from '../domain/Error';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authMiddleware = (role?: 'user' | 'company') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new ExpressError('Authentication required', 401);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded.user;  // Store just the user part since we wrapped it in generateToken

      if (role && req.user.role !== role) {
        throw new ExpressError('Unauthorized access', 403);
      }

      next();
    } catch (error) {
      throw new ExpressError('Invalid token', 401);
    }
  };
};