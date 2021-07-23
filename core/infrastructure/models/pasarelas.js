/* jshint indent: 2 */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Pasarelas extends Model { }

Pasarelas.init({
  'id': {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  'nombre': {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  'alias': {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  'descripcion': {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  'email': {
    type: DataTypes.STRING(45),
    allowNull: false,
    comment: "null"
  },
  'usuarios_id': {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: "pasarelas"
});

module.exports = Pasarelas
