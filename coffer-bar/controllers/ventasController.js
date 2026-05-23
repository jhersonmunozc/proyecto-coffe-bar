const ventaService = require('../services/ventaService')

const ventasController = {
  registrarVenta: function (req, res) {
    const { venta_id, productos, total } = req.body
    const baristaId = req.usuario.usuario_id

    if (!venta_id || !productos || !total || productos.length === 0) {
      return res.status(400).json({ message: 'Datos incompletos' })
    }

    ventaService.registrarVenta(venta_id, baristaId, productos, total)
      .then(resultado => {
        res.status(201).json({
          venta: resultado.venta,
          alertas_generadas: resultado.alertas
        })
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  obtenerVentas: function (req, res) {
    const { fecha_inicio, fecha_fin, barista_id } = req.query
    ventaService.obtenerVentas({ fecha_inicio, fecha_fin, barista_id })
      .then(ventas => res.status(200).json(ventas))
      .catch(err => res.status(500).json({ message: err.message }))
  },

  obtenerMisVentas: function (req, res) {
    const baristaId = req.usuario.usuario_id
    const { fecha_inicio, fecha_fin } = req.query
    ventaService.obtenerMisVentas(baristaId, { fecha_inicio, fecha_fin })
      .then(ventas => res.status(200).json(ventas))
      .catch(err => res.status(500).json({ message: err.message }))
  },

  obtenerVentasDiarias: function (req, res) {
    ventaService.obtenerVentasDiarias()
      .then(resultado => {
        res.status(200).json(resultado)
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  }
}

module.exports = ventasController
