"use strict";
const { logger, responses, CodeError } = require("../helpers");
const Pasarela = require('../infrastructure/models/pasarelas');
const { servicioPasarelas } = require('../services');
const pagination = require("../helpers/pagination").getPagination;

const agregar = async (req, res) => {

    try {
        const { id } = req.jwt_data;
        const pasarela = req.body
        const resultado = await servicioPasarelas.añadirPasarela(id, pasarela)
        res.json(responses.success(resultado))

    } catch (error) {
        logger.error("agregar pasarelas", error)
        res.json(responses.error(error))
    }
}
const modificar = async (req, res) => {

    try {

        const { id } = req.params;
        const pasarela = req.body
        const resultado = await Pasarela.update(pasarela, {
            where: {
                id
            }
        })
        if (resultado[0] === 0) throw new CodeError('INVALID_BODY', 'Los datos de la pasarela no son correctos');
        res.json(responses.success(resultado))

    } catch (error) {
        logger.error("modificar pasarela", error)
        res.json(responses.error(error))
    }
}
const obtenerUno = async (req, res) => {

    try {
        const { id } = req.params;
        const pasarela = await Pasarela.findOne({ where: { id } })

        res.json(responses.success(pasarela))

    } catch (error) {
        logger.error("obtener una pasarela", error)
        res.json(responses.error(error))
    }
}

const obtenerTodos = async (req, res) => {
    const { page, size, } = req.query;
    const { limit, offset } = pagination(page, size);
    try {
        const usuarios = await Pasarela.findAndCountAll({
            limit,
            offset,
            order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['createdAt', 'DESC'],
            ],
        });
        res.json(responses.success(usuarios))

    } catch (error) {
        logger.error("Obtener pasarelas", error)
        res.json(responses.error(error))
    }
}
const misPasarelas = async (req, res) => {
    try {
        const { id } = req.jwt_data;
        const resultado = await Pasarela.findAll({
            where: {
                usuarios_id: id
            }, order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['createdAt', 'DESC'],
            ]
        })
        res.json(responses.success(resultado))

    } catch (error) {
        logger.error("mis pasarelas", error)
        res.json(responses.error(error))
    }
}
const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        await Pasarela.destroy({
            where: {
                id
            }
        });
        res.json(responses.success("Pasarela eliminada"))

    } catch (error) {
        logger.error("Eliminar pasarela", error)
        res.json(responses.error(error))
    }
}
module.exports = { agregar, obtenerUno, obtenerTodos, misPasarelas, eliminar, modificar }
