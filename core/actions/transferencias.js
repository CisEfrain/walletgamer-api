"use strict";
const { logger, responses, CodeError } = require("../helpers");
const Usuario = require('../infrastructure/models/usuarios');
const { servicioTransacciones, servicioOperaciones } = require('../services/');
const sequelize = require('../infrastructure/db');

/*
Verificas que el usuario a quien le va a transferir existe
Creas la transferencia estado completa
Creas la operación Para el que transfiere suma 0
Creas la operación para quien recibe la transferencia suma 1
Listo
*/
const agregar = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id,email } = req.jwt_data;
        const { monto, beneficiario } = req.body
        const tipo = "Transferencia";
        const busquedaBeneficiario = await Usuario.findOne({ where: { email: beneficiario } });
        const beneficiarioId = busquedaBeneficiario.getDataValue('id');
        if (!beneficiarioId) throw new CodeError('NO_RESULTS', 'Usuario inexistente');
        const saldo = await servicioOperaciones.saldo(id)
        if (monto > saldo) throw new CodeError('INVALID_BODY', 'El monto solicitado excede el saldo disponible.');

        const transaccion = await servicioTransacciones.registro(monto, "Completada", t,`${tipo} de ${email} a ${beneficiario}`)

        const idTransaccion = transaccion.getDataValue('id')

        if (!idTransaccion) throw new CodeError('ERROR', 'No se ha podido realizar la transaccion');

        const operacion = await servicioOperaciones.registro(0, tipo, id, idTransaccion, t)
        const operacionBeneficiario = await servicioOperaciones.registro(1, tipo, beneficiarioId, idTransaccion, t)
        const idOperacion = operacion.getDataValue('id')
        const idOperacionBeneficiario = operacionBeneficiario.getDataValue('id')

        if (!idOperacion || !idOperacionBeneficiario) throw new CodeError('ERROR', 'No se ha podido realizar la operacion');

        await t.commit();

        res.json(responses.success(transaccion))

    } catch (error) {
        logger.error("agregar desembolsos", error)
        await t.rollback();
        res.json(responses.error(error))
    }
}


module.exports = { agregar }
