import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { createUserSchema } from '../schemas/authSchemas.js';
import { createUser } from '../services/createUser.js';
import { createApiError } from '../middleware/errorHandler.js';

const router = Router();

router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createUserSchema.parse(req.body);

    const user = await createUser(validatedData);

    res.status(201).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      next(createApiError('Email already exists', 409));
      return;
    }
    
    next(error);
  }
});

export { router as userRoutes };
