import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { signInSchema } from '../schemas/authSchemas.js';
import { authenticateUser } from '../services/authenticateUser.js';
import { getTokenExpirationTime } from '../services/jwtService.js';
import { userRepository } from '../infrastructure/userRepository.js';
import { createApiError } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { invalidTokenRepository } from '../infrastructure/invalidTokenRepository.js';

const router = Router();

router.post('/sign-in', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = signInSchema.parse(req.body);

    const { jwtToken } = await authenticateUser(validatedData);

    const user = await userRepository.findByEmail(validatedData.email);
    
    if (!user) {
      throw createApiError('User not found', 404);
    }

    res.status(200).json({
      jwtToken,
      userData: {
        email: user.email,
      },
      tokenType: 'Bearer',
      expiresAt: getTokenExpirationTime(jwtToken),
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication failed') {
      next(createApiError('Invalid email or password', 401));
      return;
    }
    
    next(error);
  }
});

router.post('/sign-out', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // We know user exists and has a token because of authenticateToken middleware
    const user = req.user!; 
    const token = user.token!
    
    const expirationTime = getTokenExpirationTime(token);
    const expiresAt = new Date(expirationTime * 1000);

    await invalidTokenRepository.invalidateToken({
      tokenId: user.tokenId,
      expiresAt: expiresAt,
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as authRoutes };
