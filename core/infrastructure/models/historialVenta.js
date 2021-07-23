/* jshint indent: 2 */

const { Model, DataTypes } = require('sequelize');
const Ventas = require('./ventas');
const sequelize = require('../db');

class Historial extends Model {}

Historial.init({
  'id': {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  'estado': {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  'mensaje': {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  sequelize,
  modelName: "historial"
});

Ventas.hasMany(Historial,{
  foreignKey: {
    name: 'ventas_id',
    allowNull: false 

  }
});

Historial.belongsTo(Ventas, {
  foreignKey: {
    name: 'ventas_id',
    allowNull: false 

  }
})

module.exports = Historial
