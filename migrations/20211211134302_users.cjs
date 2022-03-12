// +-------------+--------------+------+-----+---------+-------+
// | Field       | Type         | Null | Key | Default | Extra |
// +-------------+--------------+------+-----+---------+-------+
// | username    | varchar(128) | NO   | PRI | NULL    |       |
// | displayName | text         | NO   |     | NULL    |       |
// | password    | text         | YES  |     | NULL    |       |
// | ltiEnabled  | tinyint(1)   | NO   |     | 0       |       |
// | avatar      | text         | NO   |     | NULL    |       |
// +-------------+--------------+------+-----+---------+-------+

exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.string('username').notNullable().primary();
    table.text('displayName').notNullable();
    table.text('password').defaultTo(null);
    table.boolean('ltiEnabled').notNullable().defaultTo(false);
    table.jsonb('avatar').notNullable();
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
