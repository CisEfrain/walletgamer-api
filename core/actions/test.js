const { stripe, servicioOperaciones, servicioEmails } = require('../services');
const { responses } = require('../helpers')

const data = require("../infrastructure/static_data")




const pagoStripe = async (req, res) => {

    res.json(responses.success(await servicioEmails.sendEmail()))

   /*  try {
        const pedido  = {
            monto: req.body.monto,
            nombre: req.body.nombre,
            cantidad: req.body.cantidad
        }
        const resultado = await stripe.pago(pedido)
        res.json(responses.success(resultado))

    } catch (error) {
        console.log(error)
    } */
}

module.exports = pagoStripe


const nuevaVentaPasarela = async (req, res) => {
    const { pasarela, idPublicacion, cantidad } = req.body
    // consultar datos de publicacion
    // crear pago y venta
    // switch metodo de pago
    // enviar link redireccion
}

const pagoCompleto = async (req, res) => {
    // consultar datos venta y pago
    // verificar tipo de pago
    // switch accion segu medio de pago
    // redireccion a pago completo
}
