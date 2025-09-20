import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { postRepository } from '../infrastructure/postRepository.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { uploadImage } from '../middleware/uploadImage.js';
import { createApiError } from '../middleware/errorHandler.js';
import { z } from 'zod';

const router = Router();

// Schema for validating post creation data
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
});

// POST /api/posts - Create a new post with image upload
router.post('/', authenticateToken, uploadImage, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw createApiError('Image file is required', 400);
    }

    const validatedData = createPostSchema.parse(req.body);
    
    const user = req.user!;
    
    const post = await postRepository.create({
      title: validatedData.title,
      description: validatedData.description,
      imagePath: req.file.filename, // Store just the filename
      userId: user.userId,
    });

    // Return the created post with imageUrl
    res.status(201).json({
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: `/uploads/${post.imagePath}`,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/posts - Get all posts
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await postRepository.findAll();
    
    // Transform posts to include imageUrl instead of imagePath
    const postsWithImageUrl = posts.map(post => ({
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: `/uploads/${post.imagePath}`,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    res.status(200).json(postsWithImageUrl);
  } catch (error) {
    next(error);
  }
});

export default router;
