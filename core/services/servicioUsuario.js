const Usuario = require('../infrastructure/models/usuarios')
const servicioToken = require('./servicioToken');
const CodeError  = require('../helpers/CodeError')

/** 
*@param usuario - objeto de usuario || id string
*@remarks
* verifica si el usuario existe
*@return - SUCCESS o NO_RESULTS .
*/

const registro = async (data) => {
    if (data.hasOwnProperty('email') && data.email) {
        const estaRegistrado = await Usuario.findOne({ where: { email: data.email } })
        if (!estaRegistrado) return await Usuario.create(data);
        throw new CodeError('ALREADY_EXIST', 'Ya existe un usuario con este email');
    } 
    else
        throw new CodeError('INVALID_BODY', 'Se debe enviar un email valido' );
}

/** 
*@param usuario - objeto de usuario
*@remarks
* verifica si el usuario existe
*@return - SUCCESS o NO_RESULTS .
*/
const autenticar = (usuario, pass) => {

    if (usuario) {
        const compare = Usuario.encriptarPass(pass, usuario.salt());
        const isEqual = passIguales(usuario.pass(), compare);

        if (!isEqual) return { code: 'INVALID_PASSWORD' };
        const jwt = servicioToken.generarToken(usuario);
        return { code: 'SUCCESS', jwt, data: usuario }
    } else {
        throw new CodeError('NO_RESULTS', 'Se debe enviar un email valido' );
    }
}
const autenticarAdmin = (usuario, pass) => {

    if (usuario) {
        const compare = Usuario.encriptarPass(pass, usuario.salt());
        const isEqual = passIguales(usuario.pass(), compare);

        if (!isEqual) return { code: 'INVALID_PASSWORD' };
        if (usuario.email !== 'info@walletgamer.com') return { code: 'INVALID_PASSWORD' };
        const jwt = servicioToken.generarToken(usuario,true);
        return { code: 'SUCCESS', jwt, data: usuario }
    } else {
        throw new CodeError('NO_RESULTS', 'Se debe enviar un email valido' );
    }
}
/** 
*@return - true si son iguales, false si no.
*/

const passIguales = (pass, compare) => {
    return pass === compare;
}
module.exports = { autenticar,autenticarAdmin, registro }