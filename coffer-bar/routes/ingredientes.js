const { Router } = require('express')
const ingredientesController = require('../controllers/ingredientesController')
const autenticacionService = require('../services/autenticacionService')

const router = Router()

// CRUD Ingredientes
router.post(
  '/',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  ingredientesController.crearIngrediente
)

router.get(
  '/',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  ingredientesController.obtenerIngredientes
)

router.get(
  '/:ing_id',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  ingredientesController.obtenerIngredientePorId
)

router.put(
  '/:ing_id',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  ingredientesController.actualizarIngrediente
)

router.delete(
  '/:ing_id',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  ingredientesController.eliminarIngrediente
)

// Endpoints adicionales de inventario
router.put(
  '/actualizar/stock',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  ingredientesController.actualizarStock
)

router.get(
  '/listado/criticos',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  ingredientesController.obtenerIngredientesCriticos
)

module.exports = router
