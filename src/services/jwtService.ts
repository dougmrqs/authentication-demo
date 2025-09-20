import 'dotenv/config';
import * as jose from 'jose';
import { randomUUID } from 'node:crypto';
import { invalidTokenRepository } from '../infrastructure/invalidTokenRepository.js';

export interface JwtPayload {
  userId: string;
  tokenId: string;
}

export async function generateJwt(userId: string): Promise<string> {
  const JWT_SECRET = getJwtSecret();
  const tokenId = randomUUID();

  const token = await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(tokenId)
    .setExpirationTime('60m')
    .sign(new TextEncoder().encode(JWT_SECRET));

  return token;
}

export function getTokenExpirationTime(token: string): number {
  const decoded = jose.decodeJwt(token);
  return decoded.exp!;
}

export function getTokenId(token: string): string {
  const decoded = jose.decodeJwt(token);
  return decoded.jti!;
}

export async function verifyJwt(token: string): Promise<JwtPayload> {
  const JWT_SECRET = getJwtSecret();

  const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
  
  const tokenId = payload.jti as string;
  
  // Check if token is in the invalid tokens list
  const isInvalid = await invalidTokenRepository.isTokenInvalid(tokenId);

  if (isInvalid) {
    throw new Error('Authorization token is invalid');
  }

  return { 
    userId: payload.userId as string,
    tokenId: tokenId
  };
}

function getJwtSecret(): string {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return JWT_SECRET;
}
