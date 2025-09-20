import 'dotenv/config';
import { get } from 'http';
import * as jose from 'jose';

export async function generateJwt(userId: string): Promise<string> {
  const JWT_SECRET = getJwtSecret();

  return await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('60m') // 60 minutes TTL as per requirement
    .sign(new TextEncoder().encode(JWT_SECRET));
}

export function getTokenExpirationTime(token: string): number {
  const decoded = jose.decodeJwt(token);
  return decoded.exp!;
}

export async function verifyJwt(token: string): Promise<{ userId: string }> {
  const JWT_SECRET = getJwtSecret();

  const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

  return { userId: payload.userId as string };
}

function getJwtSecret(): string {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return JWT_SECRET;
}
