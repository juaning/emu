// parses error so you can read error message and handle them accordingly
const pe = require('parse-error');
/* eslint-disable no-unused-vars */
/**
 * global function that will help use handle promise rejections, this article
 * this article talks about it
 * http://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
 */
const to = promise => promise.then(data => [null, data]).catch(err => [pe(err)]);

// TE stands for Throw Error
const TE = (errMessage, log) => {
  if (log === true) {
    // eslint-disable-next-line no-console
    console.error(errMessage);
  }

  throw new Error(errMessage);
};

// Error Web Response
const ReE = (res, err, code) => {
  let error = err;
  if (typeof err === 'object' && typeof err.message !== 'undefined') {
    error = err.message;
  }

  if (typeof code !== 'undefined') res.statusCode = code;

  return res.json({ success: false, error });
};

// Success Web Response
const ReS = (res, data, code) => {
  let sendData = { success: true };

  if (typeof data === 'object') {
    sendData = Object.assign(data, sendData); // merge the objects
  }

  if (typeof code !== 'undefined') res.statusCode = code;

  return res.json(sendData);
};

// This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error =>
  // eslint-disable-next-line no-console
  console.error('Uncaught Error', pe(error)));
/* eslint-enable no-unused-vars */
