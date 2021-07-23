"use strict";
const { logger, responses } = require("../helpers");
const CodeError = require("../helpers/CodeError");
const pagination = require("../helpers/pagination").getPagination;
const Usuario = require('../infrastructure/models/usuarios');
const { servicioUsuario } = require('../services');


const registro = async (req, res) => {

	try {
		const usuario = await servicioUsuario.registro(req.body)

		res.json(responses.success(usuario))

	} catch (error) {
		logger.error("Registro de usuarios", error)
		res.json(responses.error(error))
	}
}

const login = async (req, res) => {
	try {
		const { email, pass } = req.body;
		const usuario = await Usuario.findOne({ where: { email: email } })
		const { code: codeRespuesta, jwt, data } = servicioUsuario.autenticar(usuario, pass);

		res.json(responses.format(codeRespuesta, {
			usuario: data,
			jwt
		}))

	} catch (error) {
		logger.error("Login de usuarios", error)
		res.json(responses.error(error))
	}
}
const loginAdmin = async (req, res) => {
	try {
		const { email, pass } = req.body;
		const usuario = await Usuario.findOne({ where: { email: email } })
		const { code: codeRespuesta, jwt, data } = servicioUsuario.autenticarAdmin(usuario, pass);

		res.json(responses.format(codeRespuesta, {
			usuario: data,
			jwt
		}))

	} catch (error) {
		logger.error("Login de usuarios", error)
		res.json(responses.error(error))
	}
}

const obtenerUsuarios = async (req, res) => {
	const { page, size, } = req.query;
	const { limit, offset } = pagination(page, size);

	try {
		const usuarios = await Usuario.findAndCountAll(
			{
				limit,
				offset,
				order: [
					// Will escape title and validate DESC against a list of valid direction parameters
					['createdAt', 'DESC'],
				],
			});
		res.json(responses.success(usuarios))

	} catch (error) {
		logger.error("Lista  de usuarios", error)
		res.json(responses.error(error))
	}
}
const modificar = async (req, res) => {
	try {
		const { id } = req.jwt_data;
		const usuario = req.body
		const { pass } = usuario;
		if (pass) {
			const { salt } = await Usuario.findOne({ where: { id } })
			usuario.pass = Usuario.encriptarPass(pass, salt())
		}
		const resultado = await Usuario.update(usuario, {
			where: {
				id
			}
		})
		res.json(responses.success(resultado))

	} catch (error) {
		logger.error("modificar usuario", error)
		res.json(responses.error(error.descripcion))
	}
}
const modificarPass = async (req, res) => {
	try {
		const { id } = req.jwt_data;
		let { pass } = req.body;
		if (pass) {
			const { salt } = await Usuario.findOne({ where: { id } })
			pass = Usuario.encriptarPass(pass, salt())
			const resultado = await Usuario.update({ pass }, {
				where: {
					id
				}
			})
			res.json(responses.success(resultado))

		} else {
			throw new CodeError('ERROR', 'No se recibio la contraseña');
		}

	} catch (error) {
		logger.error("modificar usuario", error)
		res.json(responses.error(error))
	}
}
const miUsuario = async (req, res) => {
	try {
		const { id } = req.jwt_data;
		const usuario = await Usuario.findOne({ where: { id } });
		res.json(responses.success(usuario))
	} catch (error) {
		logger.error("Mi usuario", error)
		res.json(responses.error(error))
	}
}


module.exports = { registro, login, loginAdmin, obtenerUsuarios, miUsuario, modificar, modificarPass }
