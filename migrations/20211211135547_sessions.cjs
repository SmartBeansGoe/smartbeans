// +----------------+--------------+------+-----+---------+-------+
// | Field          | Type         | Null | Key | Default | Extra |
// +----------------+--------------+------+-----+---------+-------+
// | token          | varchar(128) | NO   | PRI | NULL    |       |
// | username       | varchar(128) | NO   |     | NULL    |       |
// | courseName     | varchar(128) | NO   |     | NULL    |       |
// | expirationTime | bigint(20)   | NO   |     | NULL    |       |
// | tokenName      | text         | YES  |     | NULL    |       |
// +----------------+--------------+------+-----+---------+-------+

exports.up = function (knex) {
  return knex.schema.createTable('sessions', (table) => {
    table.string('token').notNullable().primary();
    table.string('username').notNullable();
    table.string('courseName').notNullable();
    table.bigInteger('expirationTime').notNullable();
    table.text('tokenName').defaultTo(null);
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('sessions');
};
