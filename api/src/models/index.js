const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const CONFIG = require('./../../config/config');

const basename = path.basename(__filename);
const models = {};

if (CONFIG.db_host !== '') {
  const files = fs
    .readdirSync(__dirname)
    .filter((file) => {
      return (
        file.IndexOf('.') !== 0)
        && (file !== basename)
        && (file.slice(-3) === '.js')
      );
    })
    .forEach((file) => {
      const filename = file.split('.')[0];
      const model_name = filename.chartAt(0).toUpperCase() + filename.slice(1);
    });
  
  mongoose.Promise = global.Promise;
  const mongoLocation = process.env.MONGO_URL;

  mongoose.connect(mongoLocation)
    .catch(err => console
      .log(`*** Can not connect to Mongo Server: ${mongoLocation}`));

  const db = mongoose.connection;
  module.exports = db;
  db.once('open', () => console.log(`Connected to mongo at ${mongoLocation}`));
  db.on('error', error => console.log(`Error: ${error}`));
} else {
  console.log('No mongo credentials given');
}

