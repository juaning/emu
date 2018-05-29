const models = require('../../src/models');

module.exports = {
  up: () => models.PersonalData.create({
    firstName: 'Juan',
    lastName: 'Mignaco',
    documentId: '1435154',
    DOB: '1982-12-08',
    maritalStatus: 'single',
    address: 'Tomas Osuna 702, Luque, Paraguay',
    phone: '0981196226',
    gender: 'male',
    email: 'juaning@gmail.com',
    nationality: 'PY',
  }),
  down: queryInterface => queryInterface.bulkDelete('PersonalData', null, {}),
};
