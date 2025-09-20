import request from 'supertest';
import app from '../server.js';
import { cleanDatabase } from '../../test/helpers.js';

describe('E2E API Tests', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('POST /api/users', () => {
    const validUser = {
      email: 'test@example.com',
      password: 'StrongPass123#'
    };

    it('should create a user with valid data', async () => {
      const response = await request(app)
        .post('/api/users')
        .send(validUser)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        email: validUser.email
      });

      // Should not return password hash
      expect(response.body.passwordHash).toBeUndefined();
      expect(response.body.password).toBeUndefined();
    });

    it('should reject user with invalid email', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'invalid-email',
          password: 'StrongPass123#'
        })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: 'Invalid email format'
          })
        ])
      );
    });

    it('should reject user with weak password (less than 12 chars)', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'test@example.com',
          password: 'Weak1#'
        })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password must be at least 12 characters long'
          })
        ])
      );
    });

    it('should reject password without uppercase letter', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'test@example.com',
          password: 'weakpass123#'
        })
        .expect(400);

      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password must contain at least one uppercase letter'
          })
        ])
      );
    });

    it('should reject password without lowercase letter', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'test@example.com',
          password: 'WEAKPASS123#'
        })
        .expect(400);

      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password must contain at least one lowercase letter'
          })
        ])
      );
    });

    it('should reject password without number', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'test@example.com',
          password: 'WeakPassword#'
        })
        .expect(400);

      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password must contain at least one number'
          })
        ])
      );
    });

    it('should reject password without special character (@, #, !)', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'test@example.com',
          password: 'WeakPassword123'
        })
        .expect(400);

      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password must contain at least one special character (@, #, or !)'
          })
        ])
      );
    });

    it('should reject duplicate email', async () => {
      // Create first user
      await request(app)
        .post('/api/users')
        .send(validUser)
        .expect(201);

      // Try to create user with same email
      const response = await request(app)
        .post('/api/users')
        .send(validUser)
        .expect(409);

      expect(response.body.error).toBe('Email already exists');
    });
  });

  describe('POST /api/sign-in', () => {
    const testUser = {
      email: 'signin@example.com',
      password: 'TestPassword123#'
    };

    beforeEach(async () => {
      // Create a user for sign-in tests
      await request(app)
        .post('/api/users')
        .send(testUser)
        .expect(201);
    });

    it('should sign in with valid credentials', async () => {
      const response = await request(app)
        .post('/api/sign-in')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toMatchObject({
        jwtToken: expect.any(String),
        userData: {
          email: testUser.email
        },
        tokenType: 'Bearer',
        expiresAt: expect.any(Number)
      });

      // JWT token should have 3 parts (header.payload.signature)
      expect(response.body.jwtToken.split('.')).toHaveLength(3);

      // expiresAt should be in the future (approximately 60 minutes from now)
      const now = Math.floor(Date.now() / 1000);
      const oneHourFromNow = now + (60 * 60);
      expect(response.body.expiresAt).toBeGreaterThan(now);
      expect(response.body.expiresAt).toBeLessThanOrEqual(oneHourFromNow + 60); // Allow 1 minute buffer
    });

    it('should reject sign-in with invalid email', async () => {
      const response = await request(app)
        .post('/api/sign-in')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        })
        .expect(401);

      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should reject sign-in with invalid password', async () => {
      const response = await request(app)
        .post('/api/sign-in')
        .send({
          email: testUser.email,
          password: 'WrongPassword123#'
        })
        .expect(401);

      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should validate email format in sign-in', async () => {
      const response = await request(app)
        .post('/api/sign-in')
        .send({
          email: 'invalid-email',
          password: testUser.password
        })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: 'Invalid email format'
          })
        ])
      );
    });

    it('should require password in sign-in', async () => {
      const response = await request(app)
        .post('/api/sign-in')
        .send({
          email: testUser.email,
          password: ''
        })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password is required'
          })
        ])
      );
    });
  });

  describe('Error handling', () => {
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      // Express will handle this before our middleware
      expect(response.status).toBe(400);
    });

    it('should handle missing request body', async () => {
      const response = await request(app)
        .post('/api/users')
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });
  });
});
