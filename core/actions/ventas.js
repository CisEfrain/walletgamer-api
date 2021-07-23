/* eslint-disable camelcase */
const { logger, responses, CodeError, utils } = require("../helpers");
const Ventas = require('../infrastructure/models/ventas');
const Comisiones = require('../infrastructure/models/comisiones');
const Operaciones = require('../infrastructure/models/operaciones');
const Publicaciones = require('../infrastructure/models/publicaciones');
const Transacciones = require("../infrastructure/models/transacciones");
const Usuarios = require("../infrastructure/models/usuarios");
const Historial = require("../infrastructure/models/historialVenta");
const sequelize = require('../infrastructure/db');
const { servicioVentas, servicioTransacciones, servicioOperaciones, servicioComisiones, servicioEmail } = require('../services/');
const pagination = require("../helpers/pagination").getPagination;
const { conditions, advancedConditions } = require("../helpers/query");
const { Op } = require("sequelize");

const nueva = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const idComprador = req.jwt_data.id;
        const { cantidad, publicaciones_id, personaje } = req.body
        const saldo = await servicioOperaciones.saldo(idComprador)

        const publicacion = await Publicaciones.findOne({ where: { id: publicaciones_id } })

        const idPublicacion = publicacion.getDataValue('id')

        if (!idPublicacion) throw new CodeError('INVALID_BODY', 'La publicación no existe');

        const comprador = await Usuarios.findOne({ where: { id: idComprador } })

        const vendedor = await Usuarios.findOne({ where: { id: publicacion.usuarios_id } })

        const monto = parseFloat(publicacion.precio) * parseFloat(cantidad)

        const newCantidad = publicacion.tipo === 'oro' ? parseFloat(cantidad) * 100 : parseFloat(cantidad)

        if (monto > saldo) throw new CodeError('INVALID_BODY', 'No tienes saldo suficiente para realizar esta compra');

        if (newCantidad > publicacion.cantidad) throw new CodeError('INVALID_BODY', 'La cantidad excede a la disponible en la publicación');

        const estadoInicial = await utils.getEstado(publicacion, comprador, vendedor, personaje)

        const transaccion = await servicioTransacciones.registro(monto, "Pendiente", t, estadoInicial.historial)

        const idTransaccion = transaccion.getDataValue('id')

        if (!idTransaccion) throw new CodeError('ERROR', 'No se ha podido realizar la transaccion');

        const operacionCompra = await servicioOperaciones.registro(0, "Compra", idComprador, idTransaccion, t)

        const idOperacionCompra = operacionCompra.getDataValue('id')

        if (!idOperacionCompra) throw new CodeError('ERROR', 'No se ha podido realizar la operacion de compra');

        const idVendedor = publicacion.usuarios_id

        const operacionVenta = await servicioOperaciones.registro(1, "Venta", idVendedor, idTransaccion, t)

        const idOperacionVenta = operacionVenta.getDataValue('id')

        if (!idOperacionVenta) throw new CodeError('ERROR', 'No se ha podido realizar la operacion de venta');

        const montoComision = await utils.calculoComision(publicacion, monto)

        const comision = await servicioComisiones.registro(montoComision, idOperacionVenta, t)

        const idComision = comision.getDataValue('id')

        if (!idComision) throw new CodeError('ERROR', 'No se ha podido rgistrar la comision');

        const venta = await servicioVentas.registro(cantidad,personaje, publicaciones_id, t)

        const idVenta = venta.getDataValue('id')

        if (!idVenta) throw new CodeError('ERROR', 'La Venta no se ha registrado');

        const registroHistorial = await servicioVentas.registroHistorial(idVenta, estadoInicial, t)

        const idRegistroHistorial = registroHistorial.getDataValue('id')

        if (!idRegistroHistorial) throw new CodeError('ERROR', 'El historial de la venta no se ha registrado');

        const registroVentaOperacionesVenta = await servicioVentas.registroVentasOperaciones(idVenta, idOperacionVenta, t)

        const registroVentaOperacionesCompra = await servicioVentas.registroVentasOperaciones(idVenta, idOperacionCompra, t)

        const idPegistroVentaOperacionesVenta = registroVentaOperacionesVenta.getDataValue('id')

        const idPegistroVentaOperacionesCompra = registroVentaOperacionesCompra.getDataValue('id')

        if (!idPegistroVentaOperacionesVenta || !idPegistroVentaOperacionesCompra) throw new CodeError('ERROR', 'No se ha registrado la relación entre las operaciones y las ventas');

        const nuevaCantidad = publicacion.cantidad - newCantidad
        
        await Publicaciones.update({ cantidad: nuevaCantidad }, { where: { id: idPublicacion }, transaction: t });

        await servicioEmail.sendNotificacion(comprador, estadoInicial.comprador)

        await servicioEmail.sendNotificacion(vendedor, estadoInicial.vendedor)

        await t.commit();

        const datosVenta = await servicioVentas.datosVenta(venta.id)

        const [operacionesVendedor, operacionesComprador] = await utils.filtrarVendedorComprador(datosVenta.operaciones)

        const estado = await utils.filtrarEstadoUsuario(estadoInicial, operacionesComprador, operacionesVendedor, idComprador)

        datosVenta.estado = estado

        res.json(responses.success(datosVenta))

    } catch (error) {
        logger.error("ERROR EN NUEVA VENTA", error)
        await t.rollback();
        res.json(responses.error(error))
    }
}

const estadoOpe = async (req, res) => {
    try {
        const { id } = req.jwt_data
        const idVenta = req.params.id

        const venta = await servicioVentas.datosVenta(idVenta)

        const [vendedor, comprador] = await utils.filtrarVendedorComprador(venta.operaciones)

        const estadosOperacion = await utils.getEstado(venta.publicacione, comprador.usuario, vendedor.usuario, venta.personaje, venta.estado )

        const estado = await utils.filtrarEstadoUsuario(estadosOperacion, comprador, vendedor, id)

        if (!estado) throw new CodeError('INVALID_AUTHORIZATION', 'Usted no está autorizado para ver los datos de esta operación');

        venta.estado = estado

        res.json(responses.success(venta))

    } catch (error) {
        logger.error("Estado de una venta", error)
        res.json(responses.error(error))
    }
}

const cambiarEstado = async (req, res) => {

    const t = await sequelize.transaction();

    try {
        const { id } = req.jwt_data;

        const { idVenta } = req.params

        const venta = await servicioVentas.datosVenta(idVenta)

        const publicacion = await Publicaciones.findOne({where: { id: venta.publicaciones_id }});

        const isCambiable = await utils.validacionUsuarioCambiaEstado(publicacion, venta, id)

        if (!isCambiable) throw new CodeError('ERROR', 'El usuario no tiene permisos para cambiar de estado esta venta');

        const estadoActual = await  utils.getEstadoActual(publicacion, venta) 

        if (!estadoActual.pasoSiguiente) throw new CodeError('ERROR', 'La venta ya ha finalizado');

        const [vendedor, comprador] = await utils.filtrarVendedorComprador(venta.operaciones)

        const siguienteEstado = await  utils.getEstado( publicacion, comprador.usuario, vendedor.usuario, venta.personaje, estadoActual.pasoSiguiente )

        await Ventas.update({  estado: estadoActual.pasoSiguiente }, { where: { id: idVenta }, transaction: t  });

        await servicioVentas.registroHistorial(idVenta, siguienteEstado, t)

        const mensajeComprador = siguienteEstado.comprador

        const mensajeVendedor = siguienteEstado.vendedor

        if (!siguienteEstado.pasoSiguiente) 
            await Transacciones.update({  estado: "Completada" }, { where: { id: venta.operaciones[0].transacciones_id }, transaction: t  });

        const estado = await utils.filtrarEstadoUsuario(siguienteEstado, comprador, vendedor, id)

        const newVenta = await servicioVentas.datosVenta(idVenta)

        newVenta.estado = estado

        await servicioEmail.sendNotificacion(comprador.usuario, mensajeComprador)

        await servicioEmail.sendNotificacion(vendedor.usuario, mensajeVendedor)

        await t.commit();

        res.json(responses.success(newVenta))
        
    } catch (error) {
        await t.rollback();
        logger.error("Estado de una venta", error)
        res.json(responses.error(error))
    }

}

const obtenerTodos = async (req,res) => {
    try{
        const { id } = req.jwt_data;
        const { page, size, status_not: estado_no, status: estado } = req.query;
        const { limit, offset } = pagination(page, size);
        const resultado = await Operaciones.findAndCountAll({
            order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['createdAt', 'DESC'],
            ],
            limit,
            offset,
            include: [
                {
                    model: Transacciones,
                    required: true,
                    where: [await conditions({ estado }),
                    await advancedConditions({ estado_no }, Op.not, "_no")
                    ],
                },
                {
                    model: Ventas,
                    required: true,
                    include: [
                        { model: Publicaciones, 
                            include: [{ model: Usuarios }] }
                    ]
                },
                { model: Comisiones }, 
                { model: Usuarios }
            ]
        })
        res.json(responses.success(resultado))

    } catch (error) {

        logger.error("Estado de una venta", error)
        res.json(responses.error(error))
        
    }
}

const cambiarEstadoAdmin = async ( req, res ) =>{

    const t = await sequelize.transaction();

    try {

        const { idVenta, estado } = req.params

        const venta = await servicioVentas.datosVenta(idVenta)

        const publicacion = await Publicaciones.findOne({where: { id: venta.publicaciones_id }});

        const [vendedor, comprador] = await utils.filtrarVendedorComprador(venta.operaciones)

        const siguienteEstado = await  utils.getEstado( publicacion, comprador.usuario, vendedor.usuario, venta.personaje, estado )

        await Ventas.update({  estado: estado }, { where: { id: idVenta }, transaction: t  });

        await servicioVentas.registroHistorial(idVenta, siguienteEstado, t)

        if (estado === 'canceladaStock' || estado === 'canceladaIncumplimiento')
            await Transacciones.update({  estado: "Anulada" }, { where: { id: venta.operaciones[0].transacciones_id }, transaction: t  });

        if (estado === 'transaccionCompleta')
            await Transacciones.update({  estado: "Completada" }, { where: { id: venta.operaciones[0].transacciones_id }, transaction: t  });

        const newVenta = await servicioVentas.datosVenta(idVenta)

        await servicioEmail.sendNotificacion(comprador.usuario, siguienteEstado.comprador)

        await servicioEmail.sendNotificacion(vendedor.usuario, siguienteEstado.vendedor)

        await t.commit();

        res.json(responses.success(newVenta))


    } catch (error) {

        await t.rollback();
        logger.error("Estado de una venta", error)
        res.json(responses.error(error))
        
    }


}
const obtenerTodosAdmin = async (req, res) => {
    const { page, size, } = req.query;
    const { limit, offset } = pagination(page, size);
    try {
        const ventas = await Ventas.findAndCountAll({
            limit,
            offset,
            order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['createdAt', 'DESC'],
            ],
            include: [
                { model: Publicaciones, paranoid: false, include: [{ model: Usuarios }] },
                { model: Operaciones, include: [{ model: Usuarios }, { model: Transacciones }, { model: Comisiones }] }

            ]
        });
        res.json(responses.success(ventas))

    } catch (error) {
        logger.error("Obtener pasarelas", error)
        res.json(responses.error(error))
    }
}
module.exports = { nueva, estadoOpe, cambiarEstado, obtenerTodosAdmin, cambiarEstadoAdmin }