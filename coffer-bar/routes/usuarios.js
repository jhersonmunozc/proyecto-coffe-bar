const { Router } = require('express')
const usuariosController = require('../controllers/usuariosController')
const autenticacionService = require('../services/autenticacionService')

const router = Router()

// CRUD Usuarios - Solo Admin
router.post(
  '/',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  usuariosController.crearUsuario
)

router.get(
  '/',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  usuariosController.obtenerUsuarios
)

router.get(
  '/:usuario_id',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  usuariosController.obtenerUsuarioPorId
)

router.put(
  '/:usuario_id',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  usuariosController.actualizarUsuario
)

router.delete(
  '/:usuario_id',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  usuariosController.eliminarUsuario
)

module.exports = router
