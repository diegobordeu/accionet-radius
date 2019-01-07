const servers = {};

const s3Folder = {
  development: 'dev',
  staging: 'staging',
  test: 'test',
};

servers.development = {
  rick_sanchez: 'http://localhost:8080',
  mago_valdivia: 'http://localhost:3000',
  morty: 'http://localhost:3030',
  s3Folder: s3Folder.development,
  s3: s3Folder.development ? `https://s3.amazonaws.com/accionet-assets/${s3Folder.development}` : 'https://s3.amazonaws.com/accionet-assets',
};

servers.test = {
  rick_sanchez: 'http://localhost:8080',
  mago_valdivia: 'http://localhost:3000',
  morty: 'http://localhost:3030',
  s3Folder: s3Folder.test,
  s3: s3Folder.test ? `https://s3.amazonaws.com/accionet-assets/${s3Folder.test}` : 'https://s3.amazonaws.com/accionet-assets',
};

servers.production = {
  rick_sanchez: 'https://rsbe.herokuapp.com',
  mago_valdivia: 'https://accionetdev.herokuapp.com',
  morty: 'http://localhost:3030',
  s3Folder: s3Folder.production,
  s3: s3Folder.production ? `https://s3.amazonaws.com/accionet-assets/${s3Folder.production}` : 'https://s3.amazonaws.com/accionet-assets',
};

servers.staging = {
  rick_sanchez: 'https://rsstage.herokuapp.com',
  mago_valdivia: 'https://accstage.herokuapp.com',
  morty: 'http://localhost:3030',
  s3Folder: s3Folder.staging,
  s3: s3Folder.staging ? `https://s3.amazonaws.com/accionet-assets/${s3Folder.staging}` : 'https://s3.amazonaws.com/accionet-assets',
};

const env = process.env.NODE_ENV || 'development';

module.exports = servers[env];
