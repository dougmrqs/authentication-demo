import db from './db/connection.js';

export type User = {
  id: string;
  email: string;
  passwordHash: string;
};

class UserRepository {
  async saveUser(user: User): Promise<void> {
    const existingUser = await this.findById(user.id);

    if (existingUser) {
      await db('users')
        .where({ id: user.id })
        .update(this.userToTableRow(user));

      return;
    }

    await db('users').insert(this.userToTableRow(user));

    return;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await db('users').where({ email }).first();

    if (!user) {
      return null;
    }

    return this.tableRowToUser(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await db('users').where({ id }).first();

    if (!user) {
      return null;
    }

    return this.tableRowToUser(user);
  }

  private userToTableRow(user: User) {
    return {
      id: user.id,
      email: user.email,
      password_hash: user.passwordHash,
    };
  }

  private tableRowToUser(row: {
    id: string;
    email: string;
    password_hash: string;
  }): User {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
    };
  }
}

export const userRepository = new UserRepository();
