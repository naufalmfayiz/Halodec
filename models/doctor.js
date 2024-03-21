'use strict';
const {
  Model
} = require('sequelize');
const helper = require('../helper');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctor.belongsToMany(models.Checkup, { through: "CheckupDoctors" })
    }

    get idrCurrency() {
      return helper.idrCurrency(this.cost)
    }

  }
  Doctor.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "name is required"
        },
        notEmpty: {
          msg: "name is required"
        }
      }
    },
    specialist: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "specialist is required"
        },
        notEmpty: {
          msg: "specialist is required"
        }
      }
    },
    cost: {
      type: DataTypes.INTEGER,
      validate: {
        minCost(value) {
          if (value < 20000) {
            throw new Error(`cost minimum is Rp.20.000`)
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Doctor',
    hooks: {
      beforeCreate(doctor, option) {
        const fee = {
          "Dokter Umum": 20000,
          "Dokter Gigi": 30000,
          "Dokter Anak": 40000
        }

        let price = fee[doctor.specialist];
        doctor.cost = price;
      }
    }
  });
  return Doctor;
};