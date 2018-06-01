const express = require('express');
const PersonalDataRoutes = require('./personalDataRoutes');

const router = express.router();

/* GET home page. */
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Parcel Pending API',
    data: { version_number: 'v1.0.0' },
  });
});

router.use('/personal_data', PersonalDataRoutes);

module.exports = router;
