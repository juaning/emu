const { PersonalData } = require('../models');
const { to, ReE, ReS } = require('../../global_functions');

const create = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const personalDataInfo = req.body;
  const [err, personalData] = await to(PersonalData.create(personalDataInfo));

  if (err) return ReE(res, err, 422);
  return ReS(res, { personalData: personalData.toWeb() }, 201);
};

const getAll = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
};

module.exports = {
  create,
  getAll,
};
