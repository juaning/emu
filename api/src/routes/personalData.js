const express = require('express');
// const models = require('../models');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    data: {
      msg: 'Personal Data works!',
    },
  });
  // models.PersonalData.findAll({})
  //   .then(personalData => res.json({
  //     error: false,
  //     data: personalData,
  //   }))
  //   .catch(error => res.json({
  //     error,
  //     data: [],
  //   }));
});

router.get('/:id', (req, res) => {
  console.log(req);
  res.json({
    data: {
      msg: `Personal Data ID: ${req.params.id}`,
    },
  });
});

module.exports = router;
