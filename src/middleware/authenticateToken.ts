import type { Request, Response, NextFunction } from 'express';
import { verifyJwt, type JwtPayload } from '../services/jwtService.js';
import { createApiError } from './errorHandler.js';

// Extend the Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        token?: string;
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw createApiError('Authorization header missing', 401);
    }

    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      throw createApiError('Token missing', 401);
    }

    try {
      const payload = await verifyJwt(token);
      req.user = payload;
      req.user.token = token
      next();
    } catch (error) {
      if (error instanceof Error && error.message === 'Token has been invalidated') {
        throw createApiError('Token has been invalidated', 401);
      }
      throw createApiError('Invalid token', 401);
    }
  } catch (error) {
    next(error);
  }
};
