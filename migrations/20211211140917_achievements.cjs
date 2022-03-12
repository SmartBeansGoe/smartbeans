// +---------------+--------------+------+-----+---------+-------+
// | Field         | Type         | Null | Key | Default | Extra |
// +---------------+--------------+------+-----+---------+-------+
// | id            | int(11)      | NO   | PRI | NULL    |       |
// | evalFunc      | text         | NO   |     | NULL    |       |
// | svgPath       | varchar(128) | NO   |     | 0       |       |
// | details       | text         | NO   |     | {}      |       |
// | hidden        | tinyint(1)   | NO   |     | 0       |       |
// +---------------+--------------+------+-----+---------+-------+

exports.up = function (knex) {
  return knex.schema.createTable('achievements', (table) => {
    table.integer('id').notNullable().primary();
    table.text('evalFunc').notNullable();
    table.string('svgPath').notNullable();
    table.boolean('hidden').notNullable().defaultTo(false);
    table.boolean('enabled').notNullable().defaultTo(false);
    table.jsonb('details').notNullable().defaultTo({});
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('achievements');
};
