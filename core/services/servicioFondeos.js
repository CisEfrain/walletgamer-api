/* eslint-disable camelcase */
const Fondeo = require('../infrastructure/models/fondeo');

const registro = async ( pasarela, operacion_id, t) => {
    const datos = { pasarela, operacion_id}
    return await Fondeo.create(datos, { transaction: t })
  }


module.exports = { registro }
