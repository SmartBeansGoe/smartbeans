import { mode } from '$app/env';
import knex, { Knex } from 'knex';
import { development, production } from '../../../knexfile';

const environment = mode || 'development';
let config: Knex.Config;
switch (environment) {
  case 'development':
    config = development;
  case 'production':
    config = production;
  default:
    config = development;
}

export default knex(config);
