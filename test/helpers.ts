import db from '../src/infrastructure/db/connection.js';

export async function cleanDatabase() {
  await db('posts').del();
  await db('users').del();
}

export async function resetDatabase() {
  await db.migrate.rollback();
  await db.migrate.latest();
}
