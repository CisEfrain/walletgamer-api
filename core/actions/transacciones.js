"use strict";
const { logger, responses, CodeError } = require("../helpers");
const Transacciones = require('../infrastructure/models/transacciones');
const CONFIG = require('../../config')


const modificar = async (req, res) => {

    try {

        const { id } = req.params;
        const transaccion = req.body
        const resultado = await Transacciones.update(transaccion, {
            where: {
                id
            }
        })
        if (resultado[0] === 0) throw new CodeError('INVALID_BODY', 'Los datos de la transaccion  no son correctos');
        res.json(responses.success(resultado))

    } catch (error) {
        logger.error("modificar transaccion", error)
        res.json(responses.error(error))
    }
}

const pagoCompleto = async (req, res) =>{
    try {
        const { id } = req.params
        const transaccion = await Transacciones.findOne({where: { id }});
        transaccion.estado = "Completada";
        await transaccion.save();

    } catch (error) {
        logger.error("error pago completo", error)
    }
    res.redirect(CONFIG.URL);
}

const pagoIncompleto = async (req, res) =>{
    try {
        const { id } = req.params
        const transaccion = await Transacciones.findOne({where: { id }});
        transaccion.estado = "Anulada";
        await transaccion.save();

    } catch (error) {
        logger.error("error pago completo", error)
    }
    res.redirect(CONFIG.URL);
}

module.exports = { modificar, pagoCompleto, pagoIncompleto }
