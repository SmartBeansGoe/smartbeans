// +--------+--------------+------+-----+---------+-------+
// | Field  | Type         | Null | Key | Default | Extra |
// +--------+--------------+------+-----+---------+-------+
// | name   | varchar(128) | NO   | PRI | NULL    |       |
// | title  | text         | NO   |     | NULL    |       |
// | config | text         | NO   |     | '{}'    |       |
// +--------+--------------+------+-----+---------+-------+

exports.up = function (knex) {
  return knex.schema.createTable('courses', (table) => {
    table.string('name').notNullable().primary();
    table.text('title').notNullable();
    table.json('config').notNullable().defaultTo({}); // TODO initial
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('courses');
};
