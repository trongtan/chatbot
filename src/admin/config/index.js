import path from 'path';

const config = require('./config.json');
const custom = require('./custom.json');
const settings = require('./settings.json');
const users = require('./users.json');

const expressConfig = {
  dpath: path.join(__dirname),
  config: config,
  settings: settings,
  custom: custom,
  users: users
};

export {
  expressConfig
}
