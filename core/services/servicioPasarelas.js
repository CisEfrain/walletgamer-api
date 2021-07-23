const Pasarela = require('../infrastructure/models/pasarelas')
const Usuario = require('../infrastructure/models/usuarios');
const CodeError  = require('../helpers/CodeError')




const añadirPasarela = async (id, pasarela) => {
    const usuario = await Usuario.findOne({ where: { id } })
    if(!pasarela)  throw new CodeError( 'INVALID_BODY', 'Datos de pasarela incorrectos');
    if (!usuario) throw new CodeError( 'NO_RESULTS', 'Usuario inexistente' );
    pasarela.usuarios_id = id;
    return await Pasarela.create(pasarela)
}
module.exports = { añadirPasarela }