const responses = {
  "UNKNOWN": { code: 'UNKNOWN', status: 500, description: "Error en el servidor" },
  "ERROR": { code: 'ERROR', status: 500, description: "Error no definido" },
  "UNKNOWN_DB": { code: 'UNKNOWN_DB', status: 500, description: "Error de Base de datos" },
  "UNAUTHORIZED": { code: 'UNAUTHORIZED', status: 401, description: "Unauthorized" },
  "NO_TOKEN": { code: 'NO_TOKEN', status: 403, description: "No ha enviado el token" },
  "EXPIRED_TOKEN": { code: 'EXPIRED_TOKEN', status: 401, description: "Sesión expirada" },
  "INVALID_AUTH_HEADER": { code: 'INVALID_AUTH_HEADER', status: 401, description: "Missing `authorization` header" },
  "INVALID_AUTHORIZATION": { code: 'INVALID_AUTHORIZATION', status: 401, description: "No autorizado" },
  "INVALID_BODY": { code: 'INVALID_BODY', status: 400, description: "Request Invalido" },
  "INVALID_QUERY": { code: 'INVALID_QUERY', status: 400, description: "Query invalido" },
  "ALREADY_EXIST": { code: 'ALREADY_EXIST', status: 400, description: "El registro ya existe" },
  "INVALID_PASSWORD": { code: 'INVALID_PASSWORD', status: 400, description: "Contraseña incorrecta" },
  "UNCAUGHT_EXCEPTION": { code: 'UNCAUGHT_EXCEPTION', status: 500, description: "uncaught Exception" },
  "TOKEN_INVALID": { code: 'TOKEN_INVALID', status: 401, description: "Token no valido" },
  "NO_RESULTS": { code: 'NO_RESULTS', status: 204, description: "No se encontraron resultados" },
  "SUCCESS": { code: 'SUCCESS', status: 200, description: "La solicitud ha tenido éxito" },
  "SEQUELIZE_ERROR": { code: 'SEQUELIZE_ERROR', status: 500, description: "Error en la consulta con la base de datos" },
  "OTHER": { code: 'OTHER', status: 200, description: "Sin codigo de respuesta" },
  "INVALID_PAGO": { code: 'INVALID_PAGO', status: 400, description: "Hubo un error al tratar de realizar un pago" }
}

const success = (data = false) => {
  const response = responses.SUCCESS
  if (data) response.data = data
  return response
}

const format = (code = "OTHER", data = false) => {
  const response = responses[code]
  if (data) response.data = data
  return response
}

const error = (e) => {
  let respuesta
  if (e.codeE) {
    respuesta = responses[e.codeE]
    respuesta.message = e.message
  }
  else if (e.name) {
     respuesta = responses.SEQUELIZE_ERROR
     respuesta.message = e.message || e.original.sqlMessage
  }
  else respuesta = e

  return respuesta
}

module.exports = {success, error, format}