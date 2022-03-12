// +------------+--------------+------+-----+---------+----------------+
// | Field      | Type         | Null | Key | Default | Extra          |
// +------------+--------------+------+-----+---------+----------------+
// | id         | int(11)      | NO   | PRI | NULL    | auto_increment |
// | user       | varchar(128) | NO   |     | NULL    |                |
// | course     | varchar(128) | NO   |     | NULL    |                |
// | taskid     | int(11)      | NO   |     | NULL    |                |
// | timestamp  | bigint(20)   | NO   |     | NULL    |                |
// | content    | text         | NO   |     | NULL    |                |
// | resultType | varchar(128) | NO   |     | NULL    |                |
// | simplified | text         | NO   |     | NULL    |                |
// | details    | text         | NO   |     | NULL    |                |
// | score      | float        | NO   |     | NULL    |                |
// +------------+--------------+------+-----+---------+----------------+

exports.up = function (knex) {
  return knex.schema.createTable('submissions', (table) => {
    table.increments('id').notNullable().primary();
    table.string('user').notNullable();
    table.string('course').notNullable();
    table.integer('taskid').notNullable();
    table.bigInteger('timestamp').notNullable();
    table.text('content').notNullable();
    table.string('resultType').notNullable();
    table.jsonb('simplified').notNullable();
    table.jsonb('details').notNullable();
    table.float('score').notNullable();
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('submissions');
};
