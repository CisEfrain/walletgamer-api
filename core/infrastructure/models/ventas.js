/* jshint indent: 2 */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Operaciones = require('./operaciones');
const Publicaciones = require('./publicaciones');

class Ventas extends Model { }

Ventas.init({
  'id': {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  'cantidad': {
    type: DataTypes.FLOAT(11),
    allowNull: false,
  },
  'personaje': {
    type:  DataTypes.STRING(45),
    allowNull: true,
  },
  'estado': {
    type: DataTypes.STRING(45),
    allowNull: false,
  }
}, {
  sequelize,
  modelName: "ventas"
});

Publicaciones.hasMany(Ventas,{
  foreignKey: {
    name: 'publicaciones_id',
    allowNull: false 

  }
});

Ventas.belongsTo(Publicaciones, {
  foreignKey: {
    name: 'publicaciones_id',
    allowNull: false 

  }
})

module.exports = Ventas