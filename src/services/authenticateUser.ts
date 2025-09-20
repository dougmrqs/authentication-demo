import { userRepository } from '../infrastructure/userRepository.js';
import { verifyPassword } from './hashPassword.js';
import { generateJwt } from './jwtService.js';

type AuthenticateUserParams = {
  email: string;
  password: string;
}

export async function authenticateUser({ email, password }: AuthenticateUserParams): Promise<{ jwtToken: string }> {
  const maybeUser = await userRepository.findByEmail(email);

  if (!maybeUser) {
    throw new Error('Authentication failed');
  }

  const isPasswordValid = await verifyPassword(maybeUser.passwordHash, password);

  if (!isPasswordValid) {
    throw new Error('Authentication failed');
  }

  const token = await generateJwt(maybeUser.id);

  return { jwtToken: token };
}
