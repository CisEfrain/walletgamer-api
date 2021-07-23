/* jshint indent: 2 */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Operaciones = require('./operaciones');

class Fondeo extends Model {}

Fondeo.init({
  'id': {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  'pasarela': {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  'referencia': {
    type: DataTypes.STRING(45),
    allowNull: true
  }
}, {
  sequelize,
  modelName: "fondeo"
});
Operaciones.hasOne(Fondeo,{
  foreignKey: {
    name: 'operacion_id',
    allowNull: false 

  }
});
module.exports = Fondeo
