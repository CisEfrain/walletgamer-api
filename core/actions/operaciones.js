"use strict";
const { logger, responses, CodeError } = require("../helpers");
const Operaciones = require('../infrastructure/models/operaciones');
const Transacciones = require("../infrastructure/models/transacciones");
const Publicaciones = require("../infrastructure/models/publicaciones");
const Comisiones = require("../infrastructure/models/comisiones");
const Pasarelas = require("../infrastructure/models/pasarelas");
const Desembolso = require('../infrastructure/models/desembolsos');
const Fondeo = require('../infrastructure/models/fondeo');
const Ventas = require('../infrastructure/models/ventas');
const pagination = require("../helpers/pagination").getPagination;
const { conditions, advancedConditions } = require("../helpers/query");
const { servicioOperaciones } = require('../services');
const { Op } = require("sequelize");


const obtenerSaldo = async (req, res) => {
    try {
        const { id } = req.jwt_data;
        const monto = await servicioOperaciones.saldo(id)

        res.json(responses.success({ saldo: monto }))

    } catch (error) {
        logger.error("Obtener saldo", error)
        res.json(responses.error(error))
    }
}

const misOperaciones = async (req, res) => {
    const { page, size, status_not: estado_no, status: estado } = req.query;
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
            include: [
                {
                    model: Transacciones,
                    required: true,
                    where: [await conditions({ estado }),
                    await advancedConditions({ estado_no }, Op.not, "_no")
                    ],
                },
                {
                    model: Desembolso,
                    include: [{model: Pasarelas}]
                },
                {
                    model: Fondeo, 
                },
                {
                    model: Ventas,
                    include: [{model: Publicaciones}]
                },
                { model: Comisiones }
            ]
        })
        res.json(responses.success(resultado))

    } catch (error) {
        logger.error("mis operaciones", error)
        res.json(responses.error(error))
    }
}

module.exports = { obtenerSaldo, misOperaciones }
