/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('unlockedAssets', (table) => {
    table.primary(['user', 'assetId'])
    table.string('user').notNullable();
    table.string('assetId').notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('unlockedAssets');
};
