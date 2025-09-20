import * as argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  // OWASP recomends a memory cost of at least 19 MB
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 19,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  return await argon2.verify(hash, password);
}
