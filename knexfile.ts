import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3',
    },
    migrations: {
      directory: './src/infrastructure/db/migrations',
    },
    seeds: {
      directory: './src/infrastructure/db/seeds',
    },
    useNullAsDefault: true,
  },

  test: {
    client: 'sqlite3',
    connection: ':memory:',
    migrations: {
      directory: './src/infrastructure/db/migrations',
    },
    seeds: {
      directory: './src/infrastructure/db/seeds',
    },
    useNullAsDefault: true,
  },

  staging: {
    client: 'sqlite3',
    connection: {
      filename: './staging.sqlite3',
    },
    migrations: {
      directory: './src/infrastructure/db/migrations',
    },
    seeds: {
      directory: './src/infrastructure/db/seeds',
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: './production.sqlite3',
    },
    migrations: {
      directory: './src/infrastructure/db/migrations',
    },
    seeds: {
      directory: './src/infrastructure/db/seeds',
    },
    useNullAsDefault: true,
  },
};

export default config;
