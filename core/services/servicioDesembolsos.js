/* eslint-disable camelcase */
const CodeError = require('../helpers/CodeError');
const Desembolso = require('../infrastructure/models/desembolsos');


const registro = async (pasarelas_id, operacion_id, t) => {
    const datos = { pasarelas_id, operacion_id}
    return await Desembolso.create(datos, { transaction: t })
  }




module.exports = { registro }
