import { randomUUID } from 'node:crypto';
import { userRepository, type User } from '../userRepository.js';
import { cleanDatabase } from '../../../test/helpers.js';

describe('UserRepository', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('saveUser', () => {
    describe('when user does not exist', () => {
      it('inserts a new user successfully', async () => {
        const user: User = {
          id: randomUUID(),
          email: 'test@example.com',
          passwordHash: 'hashed_password'
        };

        await userRepository.saveUser(user);

        const foundUser = await userRepository.findById(user.id);
        expect(foundUser).toEqual(user);
      });
    });

    describe('when user already exists', () => {
      it('updates existing user', async () => {
        const userId = randomUUID();

        const initialUser: User = {
          id: userId,
          email: 'initial@example.com',
          passwordHash: 'initial_password'
        };
        await userRepository.saveUser(initialUser);

        const updatedUser: User = {
          id: userId,
          email: 'updated@example.com',
          passwordHash: 'updated_password'
        };
        await userRepository.saveUser(updatedUser);

        const foundUser = await userRepository.findById(userId);
        expect(foundUser).toEqual(updatedUser);
      });

      it('throws error when email is already registered', async () => {
        const existingEmail = 'existing@example.com';

        const initialUser: User = {
          id: randomUUID(),
          email: existingEmail,
          passwordHash: 'password1'
        };
        await userRepository.saveUser(initialUser);

        const conflictingUser: User = {
          id: randomUUID(),
          email: existingEmail,
          passwordHash: 'password2'
        };

        await expect(userRepository.saveUser(conflictingUser))
          .rejects
          .toThrow();
      });
    });
  });

  describe('findById', () => {
    it('returns user when found', async () => {
      const user: User = {
        id: randomUUID(),
        email: 'findme@example.com',
        passwordHash: 'password'
      };
      await userRepository.saveUser(user);

      const foundUser = await userRepository.findById(user.id);
      expect(foundUser).toEqual(user);
    });

    it('returns null when user not found', async () => {
      const nonExistentId = randomUUID();
      const foundUser = await userRepository.findById(nonExistentId);
      expect(foundUser).toBeNull();
    });
  });
});