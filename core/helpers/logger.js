"use strict";
// Create the logger
const log4js      = require('log4js');
const {DEBUG, BUSSINESS} = require("../../config").LOG



const logRemoto= {
    traceLogConfig: {
        appenders: {
            consoleAppender: { type: 'console' }
        },
        categories: {
            default: { appenders: ['consoleAppender'], level: 'trace'}
        }
    } 
}

const logLocal = {
    traceLogConfig: {
        appenders: {
            debug: { type: 'dateFile', filename: DEBUG, daysToKeep: 14, compress: true, keepFileExt: true},
            bussiness: { type: 'dateFile', filename: BUSSINESS, daysToKeep: 14, compress: true, keepFileExt: true},
            onlyBussiness: { type: 'logLevelFilter', appender: 'bussiness', level: 'trace', maxLevel: 'trace'  },
            consoleAppender: { type: 'console' }
        },
        categories: {
            default: { appenders: ['debug', 'onlyBussiness', 'consoleAppender'], level: 'trace'}
        }
    }
}


const { traceLogConfig } = process.env.LOCAL ? logLocal : logRemoto

log4js.configure(traceLogConfig);
const logger = log4js.getLogger();

const log = {}
const noDefined = "No definido"
log.error = (action = noDefined, description = false, data = false) => {
    logger.error(' Función : ' + action ,  description);
}

log.info = (action = noDefined, data = false) => {
    const datos = data ? 'Data: ' + JSON.stringify(data,0,null) : " "
    const string =  action + ' | ' + datos
    logger.info(string );
}

log.trace = (message, data = false) => {
    const datos = data ? 'Data: ' + JSON.stringify(data,0,null) : " "
    logger.trace( message + ' | ' + datos);
}

log.require = (procID, type, url,  body) => {
    logger.info('[' + procID.toString() + '] ' + 'Tipo : ' + type + ' | URL: ' + url +' | Body: ' );
}


log.init = (server, port) => {
    logger.info('Servidor corriendo en ' + server+  ' | puerto: ', port);
}

module.exports = log


