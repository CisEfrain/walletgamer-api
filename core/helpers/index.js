/* ---------------------------------------
EXPORTA TODAS MANEJADORES DE LA CARPETA
-------------------------------------- */ 
const fs = require("fs");
const path = require("path");

const directorios = fs.readdirSync(__dirname);

directorios.forEach((directorio) => {

    const nombreArchivo = path.basename(directorio, ".js");

	if (directorio !== "index") {
		exports[nombreArchivo] = require("./"+ nombreArchivo);
	}

});