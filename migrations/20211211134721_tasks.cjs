// +-----------------+---------+------+-----+---------+-------+
// | Field           | Type    | Null | Key | Default | Extra |
// +-----------------+---------+------+-----+---------+-------+
// | taskid          | int(11) | NO   | PRI | NULL    |       |
// | taskDescription | text    | NO   |     | NULL    |       |
// | solution        | text    | NO   |     | NULL    |       |
// | lang            | text    | NO   |     | NULL    |       |
// | tests           | text    | NO   |     | NULL    |       |
// +-----------------+---------+------+-----+---------+-------+

exports.up = function (knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.integer('taskid').notNullable().primary();
    table.jsonb('taskDescription').notNullable();
    table.text('solution').notNullable();
    table.text('lang').notNullable();
    table.jsonb('tests').notNullable();
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('tasks');
};
