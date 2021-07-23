/* jshint indent: 2 */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Transacciones extends Model {}

Transacciones.init({
  'id': {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  'monto': {
    type: DataTypes.FLOAT(11),
    allowNull: false,
    validate: {isNumeric: true}
  },
   // cuando esta anulado no suma ni resta
  'estado': {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  'identificador': {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  'descripcion': {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  sequelize,
  modelName: "transacciones"
});

module.exports = Transacciones
