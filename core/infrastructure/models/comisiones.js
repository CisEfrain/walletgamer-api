/* jshint indent: 2 */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Operaciones = require('./operaciones');

class Comisiones extends Model {}

Comisiones.init({
  'id': {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  'monto': {
    type: DataTypes.FLOAT(11),
    allowNull: false
  },
}, {
  sequelize,
  modelName: "comisiones"
});

Operaciones.hasOne(Comisiones,{
  foreignKey: {
    name: 'operacion_id',
    allowNull: false 
  }
});

module.exports = Comisiones
