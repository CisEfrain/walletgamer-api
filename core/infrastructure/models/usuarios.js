/* jshint indent: 2 */
const { Model, DataTypes } = require('sequelize');
const { crypto } = require("../../dependences/");

const sequelize = require('../db');

class Usuario extends Model { }

Usuario.init({
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
  'email': {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  'activo': {
    type: DataTypes.INTEGER(1),
    allowNull: false,
    defaultValue: 1
  },
  'telefono': {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  'rango': {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  'pass': {
    type: DataTypes.STRING(150),
    allowNull: false,
    get() {
      return () => this.getDataValue('pass')
    }
  },
  'salt': {
    type: DataTypes.STRING(45),
    get() {
      return () => this.getDataValue('salt')
    }
  }

}, {
  sequelize,
  modelName: "usuarios"
});
Usuario.generarSalt = function () {
  return crypto.randomBytes(16).toString('base64')
}
Usuario.encriptarPass = function (plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

const establecerSaltYPass = usuario => {
  if (usuario.changed('pass')) {
    usuario.salt = Usuario.generarSalt()
    usuario.pass = Usuario.encriptarPass(usuario.pass(), usuario.salt())
  }
}
Usuario.beforeCreate(establecerSaltYPass)
// Usuario.beforeUpdate(establecerSaltYPass)
module.exports = Usuario;
