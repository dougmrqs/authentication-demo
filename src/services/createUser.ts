import crypto from 'node:crypto';
import type { User } from '../infrastructure/userRepository.js';
import { userRepository } from '../infrastructure/userRepository.js';
import { hashPassword } from './hashPassword.js';

export async function createUser({
  email,
  password
}: { email: string; password: string }): Promise<User> {
  const userId = crypto.randomUUID();

  const user: User = {
    id: userId,
    email,
    passwordHash: await hashPassword(password),
  };

  await userRepository.saveUser(user);

  const createdUser = await userRepository.findById(userId);

  if (!createdUser) {
    throw new Error('User creation failed');
  }

  return createdUser;
}
