const path = require('path');

module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost:5432/gene_v_test',
    migrations: {
      directory: path.join(__dirname, '/db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/db/seeds/test'),
    },
    acquireConnectionTimeout: 10000,
  },
  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/gene_v',
    migrations: {
      directory: path.join(__dirname, '/db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/db/seeds/development'),
    },
    acquireConnectionTimeout: 10000,
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost:5432/gene_v',
    migrations: {
      directory: path.join(__dirname, '/db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/db/seeds/production'),
    },
    acquireConnectionTimeout: 10000,
  },
  staging: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost:5432/gene_v',
    migrations: {
      directory: path.join(__dirname, '/db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/db/seeds/production'),
    },
    acquireConnectionTimeout: 10000,
  },
};
