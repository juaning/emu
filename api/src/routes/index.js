const express = require('express');
const PersonalDataRouter = require('./personalData');

const router = express.Router();

router.use('/personalData', PersonalDataRouter);

module.exports = router;
