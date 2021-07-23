/* jshint indent: 2 */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Transacciones = require('./transacciones');
const Usuarios = require('./usuarios');

class Operaciones extends Model {}

Operaciones.init({
  'id': {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  'suma': {
    type: DataTypes.INTEGER(1),
    allowNull: false,
  },
  'tipo': {
    type: DataTypes.STRING(45),
    allowNull: false,
    comment: "null"
  },
  'usuarios_id': {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: "null",
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
 
}, {
  sequelize,
  modelName: "operaciones"
});
 
Operaciones.belongsTo(Transacciones,{
  foreignKey: {
    name: 'transacciones_id',
    allowNull: false 

  }
});

Operaciones.belongsTo(Usuarios,{
  foreignKey: {
    name: 'usuarios_id',
    allowNull: false 
  }
});

module.exports = Operaciones
