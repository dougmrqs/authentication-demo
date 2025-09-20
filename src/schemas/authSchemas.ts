import { z } from 'zod';

// Password validation: A-a0-9@#! + 12 chars minimum
const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[@#!]/, 'Password must contain at least one special character (@, #, or !)');

// Email validation
const emailSchema = z.email('Invalid email format');

// User registration schema
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Sign-in schema
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type SignInRequest = z.infer<typeof signInSchema>;
