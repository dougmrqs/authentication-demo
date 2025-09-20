import knex from 'knex';
import knexConfig from '../../../knexfile.js';

const environment = process.env.NODE_ENV || 'development';

const config = knexConfig[environment];

if (!config) {
  throw new Error(`No configuration found for environment: ${environment}`);
}

const db = knex(config);

export default db;
