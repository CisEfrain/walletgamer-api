/* jshint indent: 2 */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Usuarios = require('./usuarios');

class Publicacion extends Model { }

Publicacion.init({
  'id': {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    comment: "null",
    autoIncrement: true
  },
  'activo': {
    type: DataTypes.INTEGER(1),
    allowNull: false,
    defaultValue: 1
  },
  'cantidad': {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    defaultValue: 1
  },
  'tipo': {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  'precio': {
    type: DataTypes.FLOAT(11),
    allowNull: true
  },
  'reino': {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  'faccion': {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  'clase': {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  'nivel': {
    type: DataTypes.INTEGER(11),
    allowNull: true
  },
  'descripcion': {
    type: DataTypes.STRING(255),
    allowNull: true,
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
  paranoid: true,
  modelName: "publicaciones"
});

Usuarios.hasMany(Publicacion,{
  foreignKey: {
    name: 'usuarios_id',
    allowNull: false 

  }
});

Publicacion.belongsTo(Usuarios, {
  foreignKey: {
    name: 'usuarios_id',
    allowNull: false 

  }
})

module.exports = Publicacion

