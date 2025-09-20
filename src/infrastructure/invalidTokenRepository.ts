import db from './db/connection.js';

export interface InvalidToken {
  tokenId: string;
  expiresAt: Date;
}

export interface CreateInvalidTokenData {
  tokenId: string;
  expiresAt: Date;
}

class InvalidTokenRepository {
  async invalidateToken(data: CreateInvalidTokenData): Promise<void> {
    await db('invalid_tokens').insert({
      token_id: data.tokenId,
      expires_at: data.expiresAt,
    });
  }

  async isTokenInvalid(tokenId: string): Promise<boolean> {
    const result = await db('invalid_tokens')
      .where('token_id', tokenId)
      .first();
      
    return !!result;
  }

  async cleanupExpiredTokens(): Promise<number> {
    const deletedCount = await db('invalid_tokens')
      .where('expires_at', '<', new Date())
      .del();
      
    return deletedCount;
  }
}

export const invalidTokenRepository = new InvalidTokenRepository();
