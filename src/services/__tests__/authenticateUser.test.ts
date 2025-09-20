import { authenticateUser } from '../authenticateUser.js';
import { userRepository } from '../../infrastructure/userRepository.js';
import * as hashPassword from '../hashPassword.js';
import * as jwtService from '../jwtService.js';
import { cleanDatabase } from '../../../test/helpers.js';

describe('authenticateUser Service', () => {
  beforeEach(async () => {
    await cleanDatabase();
    vi.restoreAllMocks();
  });

  it('returns JWT token for valid credentials', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      passwordHash: 'hashed_password'
    };
    
    vi.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
    vi.spyOn(hashPassword, 'verifyPassword').mockResolvedValue(true);
    vi.spyOn(jwtService, 'generateJwt').mockResolvedValue('mock-jwt-token');

    const result = await authenticateUser({
      email: 'test@example.com',
      password: 'correct-password'
    });

    expect(result).toEqual({ jwtToken: 'mock-jwt-token' });
    expect(jwtService.generateJwt).toHaveBeenCalledWith('user-123');
  });

  it('throws error when user does not exist', async () => {
    vi.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

    await expect(authenticateUser({
      email: 'nonexistent@example.com',
      password: 'any-password'
    })).rejects.toThrow('Authentication failed');
  });

  it('throws error when password is invalid', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      passwordHash: 'hashed_password'
    };
    
    vi.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
    vi.spyOn(hashPassword, 'verifyPassword').mockResolvedValue(false);

    await expect(authenticateUser({
      email: 'test@example.com',
      password: 'wrong-password'
    })).rejects.toThrow('Authentication failed');
  });
});
