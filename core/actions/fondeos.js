"use strict";
const { logger, responses, CodeError } = require("../helpers");
const Fondeo = require('../infrastructure/models/fondeo');
const Usuario = require("../infrastructure/models/usuarios");
const Operaciones = require("../infrastructure/models/operaciones");
const Transacciones = require('../infrastructure/models/transacciones');
const { servicioFondeos, servicioTransacciones, servicioOperaciones, servicioPagos } = require('../services/');
const sequelize = require('../infrastructure/db');
const pagination = require("../helpers/pagination").getPagination;

const agregar = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.jwt_data;
        const { pasarela, monto } = req.body

        const usuario = await Usuario.findOne({ where: { id } })

        const nombrePasarela = pasarela === 'personalizado' ? 'medio de pago personalizado' : pasarela

        const descripcion = "Haz agregado fondos  mediante "+ nombrePasarela 

        const transaccion = await servicioTransacciones.registro(monto, "Pendiente", t, descripcion)

        const idTransaccion = transaccion.getDataValue('id')

        if (!idTransaccion) throw new CodeError('ERROR', 'No se ha podido realizar la transaccion');

        const operacion = await servicioOperaciones.registro(1, "Fondeo", id, idTransaccion, t)

        const idOperacion = operacion.getDataValue('id')

        if (!idOperacion) throw new CodeError('ERROR', 'No se ha podido realizar la operacion');

        const fondeo = await servicioFondeos.registro(pasarela, idOperacion, t)

        const idFondeo = fondeo.getDataValue('id')

        if (!idFondeo) throw new CodeError('ERROR', 'No se ha podido realizar el desembolso');

        const pago = await servicioPagos(usuario.email, pasarela, monto, idTransaccion)

        await t.commit();

        res.json(responses.success(pago))

    } catch (error) {
        logger.error("ERROR EN FONDEO", error)
        await t.rollback();
        res.json(responses.error(error))
    }
}

const modificar = async (req, res) => {
    try {
        const { id } = req.params;
        const fondeo = req.body
        const resultado = await Fondeo.update(fondeo, {
            where: {
                id
            }
        })
        if (resultado[0] === 0) throw new CodeError('INVALID_BODY', 'Los datos del fondeo no son correctos');
        res.json(responses.success(resultado))

    } catch (error) {
        logger.error("modificar fondeo", error)
        res.json(responses.error(error.descripcion))
    }
}
const misFondeos = async (req, res) => {
    const { page, size, } = req.query;
    const { limit, offset } = pagination(page, size);
    try {
        const { id } = req.jwt_data;
        const resultado = await Operaciones.findAndCountAll({
            where: {
                usuarios_id: id
            },
            order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['createdAt', 'DESC'],
            ],
            limit, offset,
            include: [{
                model: Transacciones,
                required: true
            },
            {
                model: Fondeo,
                required: true
            }
            ]
        });

        res.json(responses.success(resultado))

    } catch (error) {
        logger.error("mis fondeos", error)
        res.json(responses.error(error))
    }
}
const obtenerUno = async (req, res) => {
    try {
        const { id } = req.params;
        const fondeo = await Operaciones.findOne({
            where: {
                id
            },
            include: [{
                model: Transacciones,
            },
            {
                model: Fondeo,
            }
            ]
        }).then(item => {
            if (!item.fondeo || !item.fondeo.length) {
                return {};
            }
        });;
        res.json(responses.success(fondeo))

    } catch (error) {
        logger.error("obtener una fondeo", error)
        res.json(responses.error(error))
    }
}

const obtenerTodos = async (req, res) => {
    const { page, size, } = req.query;
    const { limit, offset } = pagination(page, size);
    try {
        const fondeos = await Operaciones.findAndCountAll({
            limit, offset,
            order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['createdAt', 'DESC'],
            ],
            include: [{
                model: Transacciones,
                required: true
            },
            {
                model: Fondeo,
                required: true
            }
            ]
        });
        res.json(responses.success(fondeos))

    } catch (error) {
        logger.error("Obtener fondeos", error)
        res.json(responses.error(error))
    }
}
const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        await Fondeo.destroy({
            where: {
                id
            }
        });
        res.json(responses.success("Fondeo eliminada"))

    } catch (error) {
        logger.error("Eliminar fondeo", error)
        res.json(responses.error(error))
    }
}
module.exports = { agregar, obtenerUno, obtenerTodos, eliminar, modificar, misFondeos }
