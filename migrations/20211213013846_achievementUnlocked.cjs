// +---------------+--------------+------+-----+---------+-------+
// | Field         | Type         | Null | Key | Default | Extra |
// +---------------+--------------+------+-----+---------+-------+
// | achievementId | int(11)      | NO   | PRI | NULL    |       |
// | user          | varchar(128) | NO   | PRI | NULL    |       |
// | unlocked      | bigInt(20)   | NO   | PRI | NULL    |       |
// +---------------+--------------+------+-----+---------+-------+

exports.up = function (knex) {
  return knex.schema.createTable('unlockedAchievements', (table) => {
    table.primary(['achievementId', 'user']);
    table.integer('achievementId').notNullable();
    table.string('user').notNullable();
    table.bigInteger('unlocked').notNullable();
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('unlockedAchievements');
};
