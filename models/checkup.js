'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Checkup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Checkup.belongsTo(models.User, { foreignKey: "UserId" })
      Checkup.belongsToMany(models.Doctor, { through: "CheckupDoctors" })
    }
  }
  Checkup.init({
    UserId: DataTypes.INTEGER,
    appointment: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Checkup',
  });
  return Checkup;
};