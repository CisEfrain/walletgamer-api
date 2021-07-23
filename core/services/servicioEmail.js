"use strict";
const nodemailer = require('nodemailer');
const Email = require('email-templates');
const CONFIG = require("../../config")

const transport = {
    host: "smtp.gmail.com",
    port: 587,
    ssl: false,
    tls: true,
    auth: {
        user: "info@walletgamer.com",
        pass: "Gamer5000!!!" 
    }
}
const enviarRecuperarPass = (usuario) => {
    usuario.url = CONFIG.URL
    const email = new Email({
        message: {
            from: {
                name: 'Notificación WalletGamer',
                address: 'info@walletgamer.com'
            },
            replyTo: 'info@walletgamer.com',
            subject: "Recupera tu contraseña"
        },
        transport,
        // uncomment below to send emails in development/test env:
        send: true,
        preview: { open: false },

    });
    email
        .send({
            template: 'recuperar-pass',
            message: {
                to: usuario.email
            },
            locals: {usuario}
        })
        .then(res => {
            console.log('res.originalMessage', res.originalMessage)
        })
        .catch(e => console.error(e));
}
const sendEmail = () => {
    const email = new Email({
        message: {
            from: {
                name: 'Notificación WalletGamer',
                address: 'info@walletgamer.com'
            },
            replyTo: 'info@walletgamer.com',
        },
        transport,
        // uncomment below to send emails in development/test env:
        send: true,
        preview: { open: false },

    });
    email
        .send({
            template: "test",
            message: {
                to: "kalinca15@gmail.com",
                subject: "notificacion.principal"
            },
            locals: {
                name:"cis"
            }
        })
        .then(res => {
            console.log('res.originalMessage', res.originalMessage)
        })
        .catch(console.error);
}

const sendNotificacion = (usuario, notificacion) => {
    const email = new Email({
        message: {
            from: {
                name: 'Notificación Wallet Gamer',
                address: 'info@walletgamer.com'
            },
            replyTo: 'info@walletgamer.com',
        },
        transport,
        // uncomment below to send emails in development/test env:
        send: true,
        preview: { open: false },

    });
    email
        .send({
            template: "notificacion",
            message: {
                to: usuario.email,
                subject: notificacion.principal
            },
            locals: {
                mensaje: notificacion.mail,
                nombre: usuario.nombre
            }
        })
        .then(res => {
            console.log('res.originalMessage', res.originalMessage)
        })
        .catch(console.error);
} 

module.exports = { sendEmail, enviarRecuperarPass, sendNotificacion }