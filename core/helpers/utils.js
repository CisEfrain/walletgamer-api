const { publicaciones } = require("../infrastructure/static_data");
const estadosOro = require("../infrastructure/static_data/estadosOro.json");
const estadosPersonaje = require("../infrastructure/static_data/estadosPersonaje.json");
// const estadosItem = require("../infrastructure/static_data/estadosItem.json");

const getEstado = async ( publicacion, comprador, vendedor, personaje, estado = "pagoCompleto" ) => {
    
    const tipos = {
        "oro": estadosOro,
        "personaje": estadosPersonaje
    }

    const estadoActual = JSON.parse(JSON.stringify(tipos[publicacion.tipo][estado])) 

    const nombreComprador = comprador.nombre

    const nombreVendedor = vendedor.nombre

    const nombrePublicacion = publicaciones[publicacion.tipo].nombre


    estadoActual.historial = reemplazarTags(estadoActual.historial, nombreComprador, nombreVendedor, nombrePublicacion, personaje )
    
    // estadoActual.notificacion = reemplazarTags(estadoActual.notificacion, nombreComprador, nombreVendedor, nombrePublicacion )

    estadoActual.vendedor.principal = reemplazarTags(estadoActual.vendedor.principal , nombreComprador, nombreVendedor, nombrePublicacion, personaje )

    estadoActual.vendedor.secundario = reemplazarTags(estadoActual.vendedor.secundario, nombreComprador, nombreVendedor, nombrePublicacion, personaje )

    estadoActual.vendedor.mail = reemplazarTags(estadoActual.vendedor.mail, nombreComprador, nombreVendedor, nombrePublicacion, personaje )

    if (estadoActual.vendedor.instrucciones)
        estadoActual.vendedor.instrucciones = reemplazarTags(estadoActual.vendedor.instrucciones, nombreComprador, nombreVendedor, nombrePublicacion, personaje )

    estadoActual.comprador.principal = reemplazarTags(estadoActual.comprador.principal, nombreComprador, nombreVendedor, nombrePublicacion, personaje )

    estadoActual.comprador.secundario = reemplazarTags(estadoActual.comprador.secundario, nombreComprador, nombreVendedor, nombrePublicacion, personaje )

    estadoActual.comprador.mail = reemplazarTags(estadoActual.comprador.mail, nombreComprador, nombreVendedor, nombrePublicacion, personaje )

    if (estadoActual.comprador.instrucciones)
        estadoActual.comprador.instrucciones = reemplazarTags(estadoActual.comprador.instrucciones, nombreComprador, nombreVendedor, nombrePublicacion, personaje )

    return estadoActual

}

const reemplazarTags = (texto, nombreComprador, nombreVendedor, nombrePublicacion, personaje ) =>{

    const reemplazar = [{'{#nombreComprador}': nombreComprador}, {"{#nombreVendedor}": nombreVendedor}, {"{#publicacion}": nombrePublicacion}, {"{#personaje}": personaje} ]

    for (const key in reemplazar) {
        const objeto = reemplazar[key]; 
        const search = Object.keys(objeto)   
        const replacer = new RegExp(search[0], 'g')
        texto = texto.replace(replacer, reemplazar[key][search[0]])
    }

    return texto
}

const calculoComision = async (publicacion, monto ) =>{
    const comision = publicaciones[publicacion.tipo].comision
    return (comision * monto)/ 100
}


const filtrarVendedorComprador = async  (operaciones) =>{
    const operacionVendedor = operaciones.filter( o =>  o.tipo === "Venta" )[0]
    const operacionComprador = operaciones.filter( o =>  o.tipo === "Compra" )[0]
    return [operacionVendedor, operacionComprador]
}

const filtrarEstadoUsuario = async (estadosOperacion, comprador, vendedor, id) =>{
    let estado = false
    
    if (comprador.usuario.id === id){
        estado = estadosOperacion
        estado = Object.assign(estado, estadosOperacion.comprador);
    }

    else if (vendedor.usuario.id === id){
        estado = estadosOperacion
        estado = Object.assign(estado, estadosOperacion.vendedor);
    }

    delete estado.comprador
    delete estado.vendedor

    return estado
}

const validacionUsuarioCambiaEstado = async (publicacion, venta, id) =>{

    const estadoActual = await getEstadoActual(publicacion, venta)

    const isVendedor = id === publicacion.usuarios_id

    return ((isVendedor && estadoActual.vendedor.botonContinuar) || (!isVendedor && estadoActual.comprador.botonContinuar) )

}

const getEstadoActual = async (publicacion, venta) =>{

    const tipos = {
        "oro": estadosOro,
        "personaje": estadosPersonaje
    }

    return JSON.parse(JSON.stringify(tipos[publicacion.tipo][venta.estado])) 
}

const getEstadoAdmin = async (publicacion, estado) =>{

    const tipos = {
        "oro": estadosOro,
        "personaje": estadosPersonaje
    }

    return JSON.parse(JSON.stringify(tipos[publicacion.tipo][estado])) 
}


module.exports = { getEstado, calculoComision, filtrarVendedorComprador, filtrarEstadoUsuario, validacionUsuarioCambiaEstado, getEstadoActual, getEstadoAdmin }