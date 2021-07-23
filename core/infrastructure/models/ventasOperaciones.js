/* jshint indent: 2 */
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Operaciones = require('./operaciones');
const Ventas = require('./ventas');

class VentasOperaciones extends Model { }


VentasOperaciones.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  selfGranted: DataTypes.BOOLEAN,

}, {
  timestamps: false,
  sequelize,
  modelName: "ventasOperaciones"
});

Ventas.belongsToMany(Operaciones, { through: VentasOperaciones });
Operaciones.belongsToMany(Ventas, { through: VentasOperaciones });
Ventas.hasMany(VentasOperaciones);
VentasOperaciones.belongsTo(Ventas);
Operaciones.hasMany(VentasOperaciones);
VentasOperaciones.belongsTo(Operaciones);


module.exports = VentasOperaciones