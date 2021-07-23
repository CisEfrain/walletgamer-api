/* eslint-disable camelcase */
const Ventas = require('../infrastructure/models/ventas');
const HistorialVenta = require('../infrastructure/models/historialVenta');
const VentasOperaciones = require('../infrastructure/models/ventasOperaciones');
const Comisiones = require('../infrastructure/models/comisiones');
const Operaciones = require('../infrastructure/models/operaciones');
const Publicaciones = require('../infrastructure/models/publicaciones');
const Transacciones = require("../infrastructure/models/transacciones");
const Usuarios = require("../infrastructure/models/usuarios");
const Historial = require("../infrastructure/models/historialVenta");


const registro = async (cantidad, personaje, publicaciones_id, t) => {
  const datos = { cantidad, personaje, estado: "pagoCompleto", publicaciones_id }
  return await Ventas.create(datos, { transaction: t })
}

const registroHistorial = async (ventas_id, estado, t) => {
  const datos = { ventas_id, mensaje: estado.historial, estado: estado.nombre }
  return await HistorialVenta.create(datos, { transaction: t })
}

const registroVentasOperaciones = async (ventaId, operacioneId, t) => {
  const datos = { ventaId, operacioneId, selfGranted: true }
  return await VentasOperaciones.create(datos, { transaction: t })
}

const datosVenta = async (idVenta) =>{
  return await Ventas.findOne({
    where: {
        id: idVenta
    },
    include: [
        {
            model: Publicaciones
        },
        {
            model: Historial
        },
        {
            model: Operaciones,
            include: [{ model: Transacciones }, { model: Comisiones }, { model: Usuarios }]
        }
    ]
  })
}


module.exports = { registro, registroHistorial, registroVentasOperaciones, datosVenta }