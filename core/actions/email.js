const Usuario = require('../infrastructure/models/usuarios');
const { logger, responses } = require("../helpers");
const { servicioEmail, servicioToken } = require('../services');
const CodeError = require('../helpers/CodeError');


const send = (req, res, next) => {

    res.send(servicioEmail.sendEmail());
}

const enviarEmailRecuperacion = async (req, res) => {
    try {
        const { email } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) throw new CodeError('NO_RESULTS', 'Email no registrado');
        const jwt = servicioToken.generarToken(usuario, '1h');
        usuario.link = jwt;
        const resultado = await servicioEmail.enviarRecuperarPass(usuario);
        res.json(responses.success(resultado))
    } catch (error) {
        logger.error("Recuperar pass", error)
        res.json(responses.error(error))
    }
}
module.exports = { send, enviarEmailRecuperacion }