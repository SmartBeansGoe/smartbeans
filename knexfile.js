// Update with your config settings.

export const development = {
  client: 'postgres',
  connection: {
    host: "change-me",
    port: 5432,
    database: 'smartbeans',
    user: 'smartbeans',
    password: 'smartbeans'
  },
  pool: {
    min: 2,
    max: 30
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};

export const production = {
  client: 'postgres',
  connection: {
    host: "change-me",
    port: 5432,
    database: 'smartbeans',
    user: 'smartbeans',
    password: 'smartbeans'
  },
  pool: {
    min: 2,
    max: 30
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
