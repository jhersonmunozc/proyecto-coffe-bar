const { Router } = require('express')
const productosController = require('../controllers/productosController')
const autenticacionService = require('../services/autenticacionService')

const router = Router()

// RUTAS PÚBLICAS (Cliente)
// Menú Público Dinámico - Consulta 1 & Filtrado por Categoría - Consulta 9
router.get('/menu', productosController.obtenerMenu)

// RUTAS ADMINISTRATIVAS (Admin)
// CRUD Productos
router.post(
  '/',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  productosController.crearProducto
)

router.get(
  '/',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  productosController.obtenerProductos
)

router.get(
  '/:prod_id',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  productosController.obtenerProductoPorId
)

router.put(
  '/:prod_id',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  productosController.actualizarProducto
)

router.delete(
  '/:prod_id',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  productosController.eliminarProducto
)

// Producto Más Vendido (KPI) - Consulta 7
router.get(
  '/kpi/top-vendido',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  productosController.obtenerProductoTopVendido
)

module.exports = router
