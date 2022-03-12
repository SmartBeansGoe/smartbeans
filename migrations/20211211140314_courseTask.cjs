// +---------------+--------------+------+-----+---------+-------+
// | Field         | Type         | Null | Key | Default | Extra |
// +---------------+--------------+------+-----+---------+-------+
// | course        | varchar(128) | NO   | PRI | NULL    |       |
// | taskid        | int(11)      | NO   | PRI | NULL    |       |
// | tags          | text         | NO   |     | '[]'    |       |
// | orderBy       | int(11)      | NO   |     | 0       |       |
// | prerequisites | text         | NO   |     | '[]'    |       |
// +---------------+--------------+------+-----+---------+-------+

exports.up = function (knex) {
  return knex.schema.createTable('courseTask', (table) => {
    table.primary(['course', 'taskid']);
    table.string('course').notNullable();
    table.integer('taskid').notNullable();
    table.jsonb('tags').notNullable().defaultTo([]);
    table.integer('orderBy').notNullable().defaultTo(0);
    table.jsonb('prerequisites').notNullable().defaultTo([]);
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('courseTask');
};
