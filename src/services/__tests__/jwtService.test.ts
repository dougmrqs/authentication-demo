import { generateJwt, verifyJwt } from '../jwtService.js';
import * as jose from 'jose';

describe('JWT Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it('generates tokens that can be verified with the test secret', async () => {
    const userId = 'verifiable-user';
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await generateJwt(userId);

    const { payload } = await jose.jwtVerify(token, secret);
    expect(payload.userId).toBe(userId);
  });

  it('throws error when JWT_SECRET is missing', async () => {
    vi.stubEnv('JWT_SECRET', undefined);

    await expect(generateJwt('test-user')).rejects.toThrow(
      'JWT_SECRET is not defined in environment variables'
    );
  });

  it('fails to verify a token older than 60 minutes', async () => {
    vi.useFakeTimers();
    const userId = 'old-token-user';

    const token = await generateJwt(userId);

    // Advance time by 70 minutes (4,200,000 milliseconds)
    vi.advanceTimersByTime(70 * 60 * 1000);

    await expect(verifyJwt(token)).rejects.toThrow();
  });

  it('successfully verifies a token within 60 minutes', async () => {
    vi.useFakeTimers();
    const userId = 'valid-token-user';

    const token = await generateJwt(userId);

    // Advance time by 30 minutes (still within the 60-minute window)
    vi.advanceTimersByTime(30 * 60 * 1000);

    const result = await verifyJwt(token);
    expect(result.userId).toBe(userId);
  });
});
