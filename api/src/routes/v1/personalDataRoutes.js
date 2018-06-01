const express = require('express');
const passport = require('passport');

const router = express.router();

const PersonalDataController = require('./../../controllers/PersonalDataController');
const custom = require('./../../middleware/custom');

require('./../../middleware/passport')(passport);

router.post(
  '/personal_data',
  passport.authenticate('jwt', { session: false }),
  PersonalDataController.create,
);

router.get(
  '/personal_data',
  passport.authenticate('jwt', { session: false }),
  PersonalDataController.getAll,
);

router.get(
  '/personal_data/:personal_data_id',
  passport.authenticate('jwt', { session: false }),
  custom.personalData,
  PersonalDataController.get,
);

router.put(
  '/personal_data/:personal_data_id',
  passport.authenticate('jwt', { session: false }),
  custom.personalData,
  PersonalDataController.update,
);

router.put(
  '/personal_data/:personal_data_id',
  passport.authenticate('jwt', { session: false }),
  custom.personalData,
  PersonalDataController.remove,
);

module.exports = router;
