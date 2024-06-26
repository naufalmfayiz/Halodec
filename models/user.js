'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.PatientDetail, { foreignKey: "UserId" })
      User.hasOne(models.Checkup, { foreignKey: "UserId" })
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate(instance, option) {
        const salt = bcrypt.genSaltSync(7);
        const hash = bcrypt.hashSync(instance.password, salt);

        instance.password = hash
      }
    }
  });
  return User;
};