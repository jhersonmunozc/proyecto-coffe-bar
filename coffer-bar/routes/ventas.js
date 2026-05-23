const { Router } = require('express')
const ventasController = require('../controllers/ventasController')
const autenticacionService = require('../services/autenticacionService')

const router = Router()

// Registro de Venta Presencial - Consulta 2
router.post(
  '/',
  autenticacionService.verificarToken,
  autenticacionService.verifyBarista,
  ventasController.registrarVenta
)

// Ventas del barista autenticado (rutas específicas primero)
router.get(
  '/mis-ventas',
  autenticacionService.verificarToken,
  autenticacionService.verifyBarista,
  ventasController.obtenerMisVentas
)

// Reporte de Ventas Diarias - Consulta 6
router.get(
  '/reporte/diario',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  ventasController.obtenerVentasDiarias
)

// Todas las ventas con filtros (solo Admin)
router.get(
  '/',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  ventasController.obtenerVentas
)

module.exports = router
