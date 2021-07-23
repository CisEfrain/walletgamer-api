/* const { Telegraf } = require('telegraf')
const CONFIG = require('../../config')

const { session } = require('telegraf')

const bot = new Telegraf(CONFIG.BOTTELEGRAM)
bot.use(session())


bot.start( async ctx => {
    ctx.session = { solicitud : false, clave: false }
    return await ctx.reply(`Hola ${ctx.from.first_name}! Soy el Bot de WalletGamer, mi función es notificarte en el proceso de compra/venta de la plataforma. \n\n Antes que nada debes solicitar un ID de notificación, si no lo haz hecho aún oprime el siguiente enlace: /settings`)
})

bot.settings(ctx => {
    if (ctx.session !== undefined){
        ctx.session.solicitud = true
    }
    else 
        ctx.session = { solicitud : true, clave: false }

    ctx.reply('Perfecto, ¿Cual es el correo electrónico que utilizas para entrar a WalletGamer?')
})

bot.on('text', async (ctx) => {
    if(ctx.session !== undefined && ctx.session.hasOwnProperty("clave") && ctx.session.clave){
        // Validar mail
        ctx.session = { solicitud : false, clave: false }
        await ctx.reply(`Listo ${ctx.from.first_name}!.  \n\n Ahora cada vez que realices una transacción o que alguien te compre te notificaré yo personalmente. `)
    }
    else if(ctx.session !== undefined && ctx.session.hasOwnProperty("solicitud") && ctx.session.solicitud){
        ctx.session.clave = true
        // Validar mail
        await ctx.reply('Genial, por seguridad hemos enviado una clave a tu correo electrónico, por favor ingresala a continuación para terminar la vinculación: ')
    }
    else{
        await ctx.reply(`${ctx.from.first_name}, te recuerdo que mi función es solo  para notificarte el estado de las transacciones en la plataforma, si no haz vinculado tu ID de notificación puedes hacerlo dando clic acá: /settings \n\n En el caso de que me escribas por consultas técnicas te seguire respondiendo siempre este párrafo, disculpa no me han entrenado para responder otra cosa`)
    }
    return true
})
 */



// bot.launch()