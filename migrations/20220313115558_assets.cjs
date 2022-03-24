/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('assets', (table) => {
    table.string('id').notNullable().primary();
    table.string('outfitId').notNullable();
    table.string('name').notNullable();
    table.jsonb('details').notNullable().defaultTo('{}');
    table.string('type').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('assets');
};
