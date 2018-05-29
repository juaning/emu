module.exports = (sequelize, DataTypes) => {
  const PersonalData = sequelize.define('personalData', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DOB: DataTypes.DATEONLY,
    maritalStatus: {
      type: DataTypes.ENUM,
      values: ['single', 'married', 'divorced', 'other'],
    },
    address: DataTypes.TEXT,
    phone: DataTypes.STRING,
    gender: {
      type: DataTypes.ENUM,
      values: ['none', 'female', 'male'],
    },
    email: DataTypes.STRING,
    nationality: DataTypes.STRING,
  }, {});
  personalData.associate = models =>
    PersonalData.belongsTo(models.User, { foreignKey: 'userId', allowNull: false });
  return PersonalData;
};
