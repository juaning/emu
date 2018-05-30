const express = require('express');
const morgan = require('morgan');
const router = require('./src/routes');

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send(`Hello World!! ENV=${process.env.TEST}`);
});

app.use('/api', router);

// eslint-disable-next-line no-console
app.listen(3000, () => console.log('emu API listening on 3000...'));
