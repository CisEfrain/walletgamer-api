/* jshint indent: 2 */
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Operaciones = require('./operaciones');
const Pasarelas = require('./pasarelas');

class Desembolso extends Model { }

Desembolso.init({
  'id': {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  'codigo_transferencia': {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  }, {
  sequelize,
  modelName: "desembolsos"
});
Operaciones.hasOne(Desembolso,{
  foreignKey: {
    name: 'operacion_id',
    allowNull: false 

  }
});
Pasarelas.hasMany(Desembolso,{
  foreignKey: {
    name: 'pasarelas_id',
    allowNull: false 

  }
});

Desembolso.belongsTo(Pasarelas, {
  foreignKey: {
    name: 'pasarelas_id',
    allowNull: false 

  }
})

module.exports = Desembolso;
