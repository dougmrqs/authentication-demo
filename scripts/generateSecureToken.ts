import crypto from 'node:crypto';

function generateSecureToken(length: number = 32): string {
  // Generate secure random bytes and encode with base64url (URL-safe base64)
  // base64url is more commonly used for tokens and doesn't need padding
  return crypto.randomBytes(length).toString('base64url');
}

console.log('Generated Secure Token:', generateSecureToken());
