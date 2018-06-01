const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');

// const v1 = require('./src/routes/v1');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Passport
app.use(passport.initialize());

// Models
// const models = require('./src/models');

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
    data: {},
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
