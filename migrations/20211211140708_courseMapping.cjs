// +------------+--------------+------+-----+---------+-------+
// | Field      | Type         | Null | Key | Default | Extra |
// +------------+--------------+------+-----+---------+-------+
// | studipId   | varchar(128) | NO   | PRI | NULL    |       |
// | courseName | varchar(128) | NO   |     | NULL    |       |
// +------------+--------------+------+-----+---------+-------+

exports.up = function (knex) {
  return knex.schema.createTable('courseMapping', (table) => {
    table.string('studipId').notNullable().primary();
    table.string('courseName').notNullable();
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('courseMapping');
};
