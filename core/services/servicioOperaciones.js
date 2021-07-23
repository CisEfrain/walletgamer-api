/* eslint-disable camelcase */
const CodeError = require('../helpers/CodeError');
const Operaciones = require('../infrastructure/models/operaciones');
const Transacciones = require('../infrastructure/models/transacciones');
const Comisiones = require('../infrastructure/models/comisiones');


const saldo = async (id, test = false) => {

  if(test) return 2000

  const operaciones = await Operaciones.findAll({
    where: {usuarios_id: id},
    include: [{model: Transacciones}, {model: Comisiones}]
  })

let monto = 0

  for (const o in operaciones) {
      const operacion = operaciones[o]
      if (operacion.transaccione.estado !== "Anulada"){
        if (operacion.tipo === "Desembolso" || operacion.tipo === "Compra" || (operacion.tipo === "Transferencia" && operacion.suma === 0))
          monto -= operacion.transaccione.monto

        if(operacion.tipo === "Devolucion" ||  (operacion.tipo === "Transferencia" && operacion.suma === 1) || (operacion.tipo === "Venta" && operacion.transaccione.estado === "Completada") || (operacion.tipo === "Fondeo" && operacion.transaccione.estado === "Completada"))
          monto += operacion.transaccione.monto
      }

      if(operacion.tipo === "Venta" && operacion.transaccione.estado === "Completada")
        monto -= operacion.comisione.monto
  }
    return  monto
}

const registro = async (suma, tipo, usuarios_id, transacciones_id, t) => {
    const datos = { suma, tipo, usuarios_id, transacciones_id}
    return await Operaciones.create(datos, { transaction: t })
  }


module.exports = { saldo, registro }