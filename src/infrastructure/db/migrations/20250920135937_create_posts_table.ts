import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('posts', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.string('image_path').notNullable();
    table.uuid('user_id').notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true); // created_at and updated_at
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('posts');
}
