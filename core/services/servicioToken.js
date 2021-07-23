const { jwt } = require("../dependences");
const SECRET_PASS_JWT = 'este es mi token que nadie lo token';
const { logger } = require("../helpers/");
const generarToken = (clave,isAdmin = false, tiempo = '12h') => {
    if (isAdmin === true){
        clave.setDataValue('isAdmin',true)
        logger.info('servicioToken', clave)
    };
     var token = jwt.sign({
        data: clave
    }, SECRET_PASS_JWT, { expiresIn: tiempo });
    return token;
};
module.exports = { generarToken, SECRET_PASS_JWT }