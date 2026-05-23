const { Router } = require('express')
const loginController = require('../controllers/loginController')
const autenticacionService = require('../services/autenticacionService')

const router = Router()

// Login público - sin autenticación
router.post('/login', loginController.login)

// Logout - requiere autenticación
router.post(
  '/logout',
  autenticacionService.verificarToken,
  loginController.logout
)

// Solicitar recuperación - público
router.post('/recuperar-contrasena', loginController.solicitarRecuperacion)

// Restablecer contraseña - requiere token de recuperación
router.post('/restablecer-contrasena', loginController.restablecerContraseña)

module.exports = router
