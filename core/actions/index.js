/* ---------------------------------------
CARGA TODAS LAS  LAS ACCIONES DE LA CARPETA Y LAS EXPORTA

Las acciones son funciones callbacks (reciben un request y envian una respuesta)

- Son llamadas desde el archivo de rutas
- Por convención el archivo de cada conjunto de acciones (ejemplo: test.js) se nombrará igual que la constante usada al importarlo 
mediante la sintaxis: const {test} = require (/actions)

-------------------------------------- */
const fs = require("fs");
const path = require("path");

const directorios = fs.readdirSync(__dirname);

directorios.forEach((directorio) => {

	const nombreArchivo = path.basename(directorio, ".js");

	if (directorio !== "index") {
		exports[nombreArchivo] = require("./" + nombreArchivo);
	}

});