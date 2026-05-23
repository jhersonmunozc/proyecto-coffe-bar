const { Router } = require('express')
const alertasController = require('../controllers/alertasController')
const autenticacionService = require('../services/autenticacionService')

const router = Router()

// Alerta de Insumos Críticos - Consulta 4
router.get(
  '/',
  autenticacionService.verificarToken,
  autenticacionService.verifyBarista,
  alertasController.obtenerAlertas
)

// Historial de Alertas de Stock - Consulta 10
router.get(
  '/historial/todas',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  alertasController.obtenerHistorialAlertas
)

// Marcar alerta como vista (Admin)
router.patch(
  '/:alert_id/marcar-visto',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  alertasController.marcarVisto
)

// Eliminar alerta (Admin)
router.delete(
  '/:alert_id',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  alertasController.eliminarAlerta
)

module.exports = router
