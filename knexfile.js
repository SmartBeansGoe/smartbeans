// Update with your config settings.

export const development = {
	client: 'mysql',
	connection: {
		database: 'smartbeans2',
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
	client: 'mysql',
	connection: {
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
