const { Router } = require('express')
const recetasController = require('../controllers/recetasController')
const autenticacionService = require('../services/autenticacionService')

const router = Router()

// CRUD de Recetas - Funcionalidad #8
router.post(
  '/',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  recetasController.crearReceta
)

router.get(
  '/',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  recetasController.obtenerRecetas
)

router.get(
  '/:prod_id',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  recetasController.obtenerRecetaPorProducto
)

router.put(
  '/:prod_id',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  recetasController.actualizarReceta
)

router.delete(
  '/:prod_id',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  recetasController.eliminarReceta
)

module.exports = router
