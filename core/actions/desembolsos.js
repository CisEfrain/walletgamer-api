/* eslint-disable camelcase */
"use strict";
const { logger, responses, CodeError } = require("../helpers");
const Desembolso = require('../infrastructure/models/desembolsos');
const Operaciones = require("../infrastructure/models/operaciones");
const Transacciones = require('../infrastructure/models/transacciones');
const Pasarelas = require('../infrastructure/models/pasarelas');
const sequelize = require('../infrastructure/db');
const { servicioDesembolsos, servicioTransacciones, servicioOperaciones } = require('../services/');
const pagination = require("../helpers/pagination").getPagination;

const agregar = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.jwt_data;
        const { pasarela_id, monto } = req.body
        const saldo = await servicioOperaciones.saldo(id)
        if (monto > saldo) throw new CodeError('INVALID_BODY', 'El monto solicitado excede el saldo disponible.');

        const pasarela = await Pasarelas.findOne({ where: { id: pasarela_id } })

        const descripcion = 'Haz solicitado un desembolso mediante ' + pasarela.nombre

        const transaccion = await servicioTransacciones.registro(monto, "Pendiente", t, descripcion)

        const idTransaccion = transaccion.getDataValue('id')

        if (!idTransaccion) throw new CodeError('ERROR', 'No se ha podido realizar la transaccion');

        const operacion = await servicioOperaciones.registro(0, "Desembolso", id, idTransaccion, t)

        const idOperacion = operacion.getDataValue('id')

        if (!idOperacion) throw new CodeError('ERROR', 'No se ha podido realizar la operacion');

        const desembolso = await servicioDesembolsos.registro(pasarela_id, idOperacion, t)

        const idDesembolso = desembolso.getDataValue('id')

        if (!idDesembolso) throw new CodeError('ERROR', 'No se ha podido realizar el desembolso');

        await t.commit();

        res.json(responses.success(desembolso))

    } catch (error) {
        logger.error("agregar desembolsos", error)
        await t.rollback();
        res.json(responses.error(error))
    }
}

const modificarEstado = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params
        const { codigo_transferencia } = req.body;
        if (!codigo_transferencia) throw new CodeError('INVALID_BODY', 'no se recibio el código de referencia');
        if (!id) throw new CodeError('INVALID_BODY', 'no se recibio el id de desembolso');
        const operacion = await Operaciones.findByPk(id,
            {
                include: [{
                    model: Transacciones,
                    required: true
                },
                {
                    model: Desembolso,
                    required: true
                }
                ]
            })
        if (!operacion) throw new CodeError('INVALID_BODY', 'nos encontramos la operacion');

        const transaccion = await Transacciones.findByPk(operacion.transaccione.getDataValue('id'));
        transaccion.estado = "Completada";

        const desembolso = await Desembolso.findByPk(operacion.desembolso.getDataValue('id'));
        desembolso.codigo_transferencia = codigo_transferencia;

        transaccion.save();
        desembolso.save();
        // const transaccion = await Transacciones.findByPk(id);

        /*         desembolso.codigo_transferencia = codigo_transferencia;
                desembolso.estado = "Completada */
        // await desembolso.save();

        t.commit();
        res.json(responses.success(operacion));
    } catch (error) {
        logger.error("modificar estado de un desembolso ", error)
        await t.rollback();
        res.json(responses.error(error))
    }
}
const modificar = async (req, res) => {
    try {
        const { id } = req.params;
        const desembolso = req.body
        const resultado = await Desembolso.update(desembolso, {
            where: {
                id
            }
        })
        if (resultado[0] === 0) throw new CodeError('INVALID_BODY', 'Los datos del desembolso no son correctos');
        res.json(responses.success(resultado))

    } catch (error) {
        logger.error("modificar desembolso", error)
        res.json(responses.error(error))
    }
}
const misDesembolsos = async (req, res) => {
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
            limit,
            offset,
            include: [{
                model: Transacciones,
            },
            {
                model: Desembolso,
                required: true,
                include: [{ model: Pasarelas }]
            }
            ]
        });
        res.json(responses.success(resultado))

    } catch (error) {
        logger.error("mis desembolsos", error)
        res.json(responses.error(error))
    }
}
const obtenerUno = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await Operaciones.findOne({
            where: {
                id
            },
            include: [{
                model: Transacciones,
            },
            {
                model: Desembolso,
            }
            ]
        }).then(item => {
            if (!item.desembolso || !item.desembolso.length) {
                return [];
            }
        });
        res.json(responses.success(resultado))

    } catch (error) {
        logger.error("obtener una desembolso", error)
        res.json(responses.error(error))
    }
}

const obtenerTodos = async (req, res) => {
    const { page, size, } = req.query;
    const { limit, offset } = pagination(page, size);

    try {
        const desembolsos = await Operaciones.findAndCountAll({
            order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['createdAt', 'DESC'],
            ],
            limit,
            offset,
            include: [{
                model: Transacciones,
            },
            {
                model: Desembolso,
                required: true,
                include: [{ model: Pasarelas }]
            }
            ]
        })
        res.json(responses.success(desembolsos))

    } catch (error) {
        logger.error("Obtener desembolsos", error)
        res.json(responses.error(error))
    }
}
const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        await Desembolso.destroy({
            where: {
                id
            }
        });
        res.json(responses.success("Desembolso eliminada"))

    } catch (error) {
        logger.error("Eliminar desembolso", error)
        res.json(responses.error(error))
    }
}
module.exports = { agregar, modificarEstado, obtenerUno, obtenerTodos, eliminar, modificar, misDesembolsos }
