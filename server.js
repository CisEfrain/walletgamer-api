const http = require('http');
const { logger } = require("./core/helpers");
const app = require("./app");
const ENV = require("./config");
const db = require("./core/infrastructure/db")
const Comisiones = require('./core/infrastructure/models/comisiones')
const Desembolsos = require('./core/infrastructure/models/desembolsos')
const Fondeo = require('./core/infrastructure/models/fondeo')
const Historial = require('./core/infrastructure/models/historialVenta')
const Operaciones = require('./core/infrastructure/models/operaciones')
const PasarelasUsuario = require('./core/infrastructure/models/pasarelas')
const Publicaciones = require('./core/infrastructure/models/publicaciones')
const Transacciones = require('./core/infrastructure/models/transacciones')
const Usuarios = require('./core/infrastructure/models/usuarios')
const Ventas = require('./core/infrastructure/models/ventas');
const VentasOperaciones = require('./core/infrastructure/models/ventasOperaciones');
// const socket = require('./socket');

const server = http.createServer(app)
 

try {
 const listen = server.listen(ENV.ADAPTERPORT, async () => {
    logger.init(ENV.SERVER, ENV.ADAPTERPORT);

    await db.authenticate({ force: false })
    .catch(err => console.log("error db auth ",err));

    logger.trace("Conexión exitosa a la base de datos")

    if (process.env.MIGRATION) {

      await Usuarios.sync({ alter: true });
      await Publicaciones.sync({ alter: true });
      await Transacciones.sync({ alter: true });
      await Operaciones.sync({ alter: true });
      await Comisiones.sync({ alter: true });
      await Fondeo.sync({ alter: true });
      await PasarelasUsuario.sync({ alter: true });
      await Ventas.sync({ alter: true });
      await Desembolsos.sync({ alter: true });
      await Historial.sync({ alter: true });
      await VentasOperaciones.sync({ alter: true });

      logger.trace("Migracion completa")

      process.exit()

    }
  });
  // socket(server);
} catch (error) {
  logger.error("MAIN", "Error al iniciar servidor", 500, error)
}
