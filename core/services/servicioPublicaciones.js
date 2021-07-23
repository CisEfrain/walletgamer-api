const Publicaciones = require('../infrastructure/models/publicaciones')
const Usuario = require('../infrastructure/models/usuarios');
const CodeError  = require('../helpers/CodeError')




const añadirPublicacion = async (id, publicacion) => {
    const usuario = await Usuario.findOne({ where: { id } })
    if(!publicacion)  throw new CodeError( 'INVALID_BODY', 'Datos de publicacion incorrectos');
    if (!usuario) throw new CodeError( 'NO_RESULTS', 'Usuario inexistente' );
    publicacion.usuarios_id = id;
    return await Publicaciones.create(publicacion)
}
module.exports = { añadirPublicacion }