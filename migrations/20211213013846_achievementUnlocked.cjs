// +---------------+--------------+------+-----+---------+-------+
// | Field         | Type         | Null | Key | Default | Extra |
// +---------------+--------------+------+-----+---------+-------+
// | achievementId | int(11)      | NO   | PRI | NULL    |       |
// | username      | varchar(128) | NO   | PRI | NULL    |       |
// | unlocked      | bigInt(20)   | NO   | PRI | NULL    |       |
// +---------------+--------------+------+-----+---------+-------+

exports.up = function (knex) {
  return knex.schema.createTable('achievementUnlocked', (table) => {
    table.primary(['achievementId', 'username']);
    table.integer('achievementId').notNullable();
    table.string('username').notNullable();
    table.bigInteger('unlocked').notNullable();
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('achievementUnlocked');
};
