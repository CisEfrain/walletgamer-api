const CONFIG = require("../../config");
const paypal = require('paypal-rest-sdk');
const stripe = require('stripe')(CONFIG.STRIPE.KEY);
const CodeError  = require('../helpers/CodeError')

const pagoStripe = async (pedido, idTransaccion) => {

  const session = await stripe.checkout.sessions.create({
    customer_email: pedido.email,
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: pedido.nombre,
            images: [CONFIG.STRIPE.IMG],
          },
          unit_amount: pedido.monto,
        },
        quantity: pedido.cantidad,
      },
    ],
    mode: 'payment',
    success_url: CONFIG.SUCCESS+idTransaccion,
    cancel_url:  CONFIG.CANCEL+idTransaccion,
  });
  
  return session
}

const pagoPaypal = async (pedido, idTransaccion) => {

	paypal.configure(CONFIG.PAYPAL);

	const paymentData = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls": {
			"return_url":  CONFIG.SUCCESS+idTransaccion,
			"cancel_url": CONFIG.CANCEL+idTransaccion
		},

		"transactions": [{
			"amount": {
				"total": pedido.monto,
				"currency": "USD",
			},
			"description": pedido.nombre +' - '+ pedido.email
		}]
  };
  

  return new Promise(function(resolve,reject){
      paypal.payment.create(paymentData, function (error, payment) {
      if (error) {
        throw new CodeError( 'INVALID_PAGO', 'Error al pagar con paypal');
      } 

      else {
        let redireccion 
        if(payment.payer.payment_method === 'paypal') {
          for(var i=0; i < payment.links.length; i++) {
            var link = payment.links[i];
            if (link.method === 'REDIRECT') {
              redireccion = link.href ;
            }
          }
          resolve( { redireccion } )
        }
      }
    })
  })
}

const main = async (email, pasarela, monto, idTransaccion, nombre = 'Fondeo Wallet Gamer', cantidad = 1)=> {
  let pago
  if (pasarela === 'stripe'){
    monto = monto * 100
    const pedido = {  monto, nombre, cantidad, email }
    pago = await pagoStripe(pedido, idTransaccion)
  }

  else if (pasarela === 'paypal'){
    const pedido = {  monto, nombre, cantidad, email }
    pago = await pagoPaypal(pedido, idTransaccion)
  }

  else if (pasarela === 'personalizado'){
    return { redireccion: 'https://jivo.chat/W8SkIuNP8W' }
  }

  else throw new CodeError( 'INVALID_PAGO', 'Medio de pago no valido');

  return pago
}


module.exports = main

