import { createUser } from '../createUser.js';
import * as hashPassword from '../hashPassword.js';
import { userRepository } from '../../infrastructure/userRepository.js';
import { cleanDatabase } from '../../../test/helpers.js';

describe('createUser Service', () => {
  const defaultUserIntent = {
    email: 'test@example.com',
    password: 'password123'
  };

  beforeEach(async () => {
    await cleanDatabase();
    vi.restoreAllMocks();
  })

  it('creates a new user and returns the user object', async () => {
    const user = await createUser(defaultUserIntent);

    expect(user).toMatchObject({
      id: expect.any(String),
      email: 'test@example.com',
      passwordHash: expect.any(String),
    });
  });

  it('throws an error if user creation fails', async () => {
    vi.spyOn(userRepository, 'findById').mockResolvedValue(null);
    
    await expect(createUser(defaultUserIntent)).rejects.toThrow('User creation failed');
  });

  it('hashes the password before saving', async () => {
    vi.spyOn(hashPassword, 'hashPassword');

    await createUser(defaultUserIntent);

    expect(hashPassword.hashPassword).toHaveBeenCalledWith(defaultUserIntent.password);
  });
});
