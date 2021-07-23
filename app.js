"use strict";

// Carga de modulos necesarios y creación de nueva aplicacion.
const express 	  = require("express"); 
const bodyParser  = require('body-parser');
const compression = require('compression');
const helmet      = require('helmet');
const rateLimit   = require("express-rate-limit");
var cors = require('cors')
 
//	Dependencias
const {logger} = require("./core/helpers");
// const {apiKey} = require("./core/middlewares");



const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
  message:
    'Too many requests, please try again later.'
});
  
const app = express();
 

app.use(bodyParser.json({ limit: '50mb' }));								// Soporte para bodies codificados en jsonsupport.
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 })); 	// Soporte para bodies codificados
app.use(compression());									// Habilita la compresion GZIP
app.use(helmet());										// Mejora la seguridad
app.use(limiter);										// Limita la cantidad de invocaciones desde la misma IP
app.use(cors());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// ---------------------------------------
// Middlewares Apy Key
// ---------------------------------------

// app.use(apiKey.validation);	

// ---------------------------------------
// Log General
// ---------------------------------------

app.use(function(req, res, next) {
  const procID = new Date().getTime();
  req.headers.procID = procID
  if (req.originalUrl !== '/live') logger.require(procID, req.method, req.originalUrl, req.body)
  next();
});


// ----- Endpoints -----------------------
const rutas = require('./core');

app.use('/', rutas);

 
// -----------------------------------------------------------------------------------------------------------------------------------------------
// Si surge una uncaughtException
// -----------------------------------------------------------------------------------------------------------------------------------------------
process.on('uncaughtException', function(error) {
	logger.error("Main",  error);		
	process.exit(1)
});

// ---------------------------------------

// catch 404 error
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render error 500
  res.status(err.status || 500);
  res.send({ error: err.message });
});

module.exports = app

 


