import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('invalid_tokens', (table) => {
    table.string('token_id').primary();
    table.timestamp('expires_at').notNullable();
    
    // Index for faster lookups
    table.index('token_id');
    table.index('expires_at');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('invalid_tokens');
}
