const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const CONFIG = require('./../../config/config');

const basename = path.basename(__filename);
const models = {};

if (CONFIG.db_host !== '') {
  // eslint-disable-next-line no-unused-vars
  const files = fs
    .readdirSync(__dirname)
    .filter(file => (
      (file.IndexOf('.') !== 0)
      && (file !== basename)
      && (file.slice(-3) === '.js')
    ))
    .forEach((file) => {
      const filename = file.split('.')[0];
      const modelName = filename.chartAt(0).toUpperCase() + filename.slice(1);
      /* eslint-disable import/no-dynamic-require */
      // eslint-disable-next-line global-require
      models[modelName] = require(`./${file}`);
      /* eslint-enable import/no-dynamic-require */
    });
  mongoose.Promise = global.Promise;
  const mongoLocation = process.env.MONGO_URL;
  /* eslint-disable no-console */
  mongoose.connect(mongoLocation)
    .catch(() => console
      .log(`*** Can not connect to Mongo Server: ${mongoLocation}`));

  const db = mongoose.connection;
  module.exports = db;
  db.once('open', () => console.log(`Connected to mongo at ${mongoLocation}`));
  db.on('error', error => console.log(`Error: ${error}`));
} else {
  console.log('No mongo credentials given');
}

/* eslint-enable no-console */
