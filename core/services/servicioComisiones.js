/* eslint-disable camelcase */
const CodeError = require('../helpers/CodeError');
const Comisiones = require('../infrastructure/models/comisiones');


const registro = async (monto, operacion_id, t) => {
    const datos = { monto, operacion_id}
    return await Comisiones.create(datos, { transaction: t })
  }




module.exports = { registro }