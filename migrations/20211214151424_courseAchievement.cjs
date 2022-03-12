// +---------------+--------------+------+-----+---------+-------+
// | Field         | Type         | Null | Key | Default | Extra |
// +---------------+--------------+------+-----+---------+-------+
// | achievementId | int(11)      | NO   | PRI | NULL    |       |
// | course        | varchar(128) | NO   |     | NULL    |       |
// +---------------+--------------+------+-----+---------+-------+

exports.up = function (knex) {
  return knex.schema.createTable('courseAchievement', (table) => {
    table.integer('achievementId').notNullable().primary();
    table.text('course').notNullable();
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('courseAchievement');
};
