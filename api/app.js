const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const PersonalData = require('./src/models/PersonalData');
// const models = require('./src/models');

// const v1 = require('./src/routes/v1');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Mongo Connection
const mongoDB = process.env.MONGO_URL;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

const juaning = new PersonalData({
  _id: new mongoose.Types.ObjectId(),
  firstName: 'Juan',
  lastName: 'Mignaco',
  documentId: '1432',
  DOB: '1982-12-08',
});

juaning.save()
  .then(() => console.log('User created'))
  .catch((err) => {
    console.error(err);
    throw err;
  });

// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Passport
app.use(passport.initialize());

// CORS. So other sites can access our API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, content-type, Authorization, Content-Type',
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// app.use('/v1', v1);

app.use('/', (req, res) => {
  res.statusCode = 200;
  res.json({
    status: 'success',
    message: 'Parcel Pending API',
    data: { test: 'oh boy!, oh boy!!' },
  });
});

// Catch 404 & forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res) => {
  // Only provide error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// eslint-disable-next-line no-console
app.listen(3000, () => console.log('emu API listening on 3000...'));

module.exports = app;
