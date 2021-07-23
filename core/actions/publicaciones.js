/* eslint-disable camelcase */
"use strict";
const { logger, responses } = require("../helpers");
const Publicaciones = require('../infrastructure/models/publicaciones');
const Usuarios = require('../infrastructure/models/usuarios');
const { servicioPublicaciones } = require('../services/');
const pagination = require("../helpers/pagination").getPagination;
const { conditions, advancedConditions } = require("../helpers/query");
const { Op } = require("sequelize");

const agregar = async (req, res) => {

    try {
        const { id } = req.jwt_data;
        const publicacion = req.body
        const resultado = await servicioPublicaciones.añadirPublicacion(id, publicacion)
        res.json(responses.success(resultado))

    } catch (error) {
        logger.error("agregar publicaciones", error)
        res.json(responses.error(error))
    }
}


const modificarEstado = async (req, res) => {
    try {
        const { id } = req.params
        const publicacion = await Publicaciones.findOne(
            {
                where: { id }
            },
        );
        publicacion.activo = !publicacion.activo;
        await publicacion.save();
        res.json(responses.success(publicacion))

    } catch (error) {
        logger.error("modificar estado de una publicacion ", error)
        res.json(responses.error(error))
    }
}
const obtenerUno = async (req, res) => {

    try {
        const { id } = req.params;
        const publicacion = await Publicaciones.findOne({ where: { id } })

        res.json(responses.success(publicacion))

    } catch (error) {
        logger.error("obtener una publicacion", error)
        res.json(responses.error(error))
    }
}

const obtenerTodos = async (req, res) => {
    const { page, size, type: tipo, active: activo } = req.query;
    const { limit, offset } = pagination(page, size);
    try {
        const publicaciones = await Publicaciones.findAndCountAll({
            limit,
            offset,
            where: { 
                tipo,
                activo, 
                cantidad: {
                    [Op.gt]: 0  
                  }         
            },
            order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['createdAt', 'DESC'],
            ],
            include: [{
                model: Usuarios,
            }
            ]
        });
        res.json(responses.success(publicaciones))

    } catch (error) {
        logger.error("Obtener publicaciones", error)
        res.json(responses.error(error))
    }
}
const misPublicaciones = async (req, res) => {
    const { page, size, type: tipo, active: activo, } = req.query;
    const { limit, offset } = pagination(page, size);
     
    try {
        const { id } = req.jwt_data;
        const resultado = await Publicaciones.findAndCountAll({
            limit,
            offset,
            order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['createdAt', 'DESC'],
            ],
            where: [
                {
                    usuarios_id: id
                },
                await conditions({ activo, tipo })
            ],
        })
        res.json(responses.success(resultado))

    } catch (error) {
        logger.error("mis publicaciones", error)
        res.json(responses.error(error))
    }
}
const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        await Publicaciones.destroy({
            where: {
                id
            }
        });
        res.json(responses.success("Publicaciones eliminada"))

    } catch (error) {
        logger.error("Eliminar publicaciones", error)
        res.json(responses.error(error))
    }
}
module.exports = { agregar, obtenerUno, modificarEstado, obtenerTodos, misPublicaciones, eliminar }
