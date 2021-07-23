const Transacciones = require('../infrastructure/models/transacciones');
const CodeError  = require('../helpers/CodeError')
const { Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');


const registro = async (monto, estado, t, descripcion = " ") => {
  const identificador = uuidv4()
  const datos = { monto, estado, identificador, descripcion}
  return await Transacciones.create(datos, { transaction: t })
}


module.exports = { registro}