
const express = require("express")
const router = express.Router()
const { token } = require("./middlewares")
const { responses } = require('./helpers')
const { usuarios, email, pasarelas, desembolsos, transferencias, fondeos, transacciones, publicaciones, test, operaciones, ventas } = require("./actions")

const data = require("./infrastructure/static_data")

// Datos estaticos
router.get('/data', (req, res) => res.json(responses.success(data)))

// Usuarios
router.get('/usuarios', token.verificarToken, usuarios.obtenerUsuarios)
router.get('/usuarios/me', token.verificarToken, usuarios.miUsuario)
router.post('/usuarios', usuarios.registro)
router.put('/usuarios', token.verificarToken, usuarios.modificar)
router.post('/enviar-email-pass', email.enviarEmailRecuperacion)
router.put('/cambiar-password/', token.verificarToken, usuarios.modificarPass)
router.post('/login', usuarios.login)
router.post('/login/admin/a55b308a-c725-4d94-9884-9962f7a4253f', usuarios.loginAdmin)

// Publicaciones 
router.post('/publicaciones', token.verificarToken, publicaciones.agregar)
router.get('/publicaciones', token.verificarToken, publicaciones.obtenerTodos)
router.get('/publicaciones/me', token.verificarToken, publicaciones.misPublicaciones)
router.get('/publicaciones/:id', token.verificarToken, publicaciones.obtenerUno)
router.delete('/publicaciones/:id', token.verificarToken, publicaciones.eliminar)
router.put('/publicaciones/:id', token.verificarToken, publicaciones.modificarEstado)

// Pasarelas
router.post('/pasarelas', token.verificarToken, pasarelas.agregar)
router.get('/pasarelas', token.verificarToken, pasarelas.obtenerTodos)
router.get('/pasarelas/me', token.verificarToken, pasarelas.misPasarelas)
router.get('/pasarelas/:id', token.verificarToken, pasarelas.obtenerUno)
router.put('/pasarelas/:id', token.verificarToken, pasarelas.modificar)
router.delete('/pasarelas/:id', token.verificarToken, pasarelas.eliminar)

// Desembolsos 
router.post('/desembolsos/', token.verificarToken, desembolsos.agregar)
router.get('/desembolsos/', token.verificarToken, desembolsos.obtenerTodos)
router.get('/desembolsos/me', token.verificarToken, desembolsos.misDesembolsos)
router.put('/desembolsos/:id', token.verificarToken, token.esAdmin, desembolsos.modificarEstado)

// Fondeos 
router.get('/fondeos/', token.verificarToken, fondeos.obtenerTodos)
router.get('/fondeos/me', token.verificarToken, fondeos.misFondeos)
router.post('/fondeos/', token.verificarToken, fondeos.agregar)
router.put('/fondeos/:id', token.verificarToken, token.esAdmin, fondeos.modificar)

// Transacciones
router.put('/transacciones/:id', token.verificarToken, transacciones.modificar)

// Transferencias
router.post('/transferencias/', token.verificarToken, transferencias.agregar)

// Operaciones
router.get('/operaciones/saldo', token.verificarToken, operaciones.obtenerSaldo)
router.get('/operaciones/me', token.verificarToken, operaciones.misOperaciones)

// Ventas
router.post('/ventas', token.verificarToken, ventas.nueva)
router.get('/ventas', token.verificarToken,  ventas.obtenerTodosAdmin)
router.get('/ventas/:id', token.verificarToken, ventas.estadoOpe)
router.put('/ventas/:idVenta', token.verificarToken, ventas.cambiarEstado)
router.put('/ventas/admin/:idVenta/:estado', token.verificarToken, token.esAdmin, ventas.cambiarEstadoAdmin)



// Pago completo
router.get('/pago/:id', transacciones.pagoCompleto)

router.get('/pago-cancelado/:id', transacciones.pagoIncompleto)

// Email
router.get('/email/send', email.send)

router.post('/test', test)

router.get('/live', (req, res) => res.json({ "msg": "Ok" }))

// Lo demas 
router.get('/*', (req, res) => res.status(404).json({ "Error": "No found" }))

router.post('/*', (req, res) => res.status(404).json({ "Error": "No found" }))



module.exports = router;