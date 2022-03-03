// Update with your config settings.

import type { Knex } from 'knex';

export const development: Knex.Config = {
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
export const production: Knex.Config = {
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
