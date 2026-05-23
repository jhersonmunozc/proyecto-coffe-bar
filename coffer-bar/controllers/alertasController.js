const alertaService = require('../services/alertaService')

const alertasController = {
  obtenerAlertas: function (req, res) {
    alertaService.obtenerAlertas()
      .then(alertas => {
        res.status(200).json(alertas || [])
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  },

  obtenerHistorialAlertas: function (req, res) {
    const { visto, limit = 50, offset = 0 } = req.query

    alertaService.obtenerHistorialAlertas(visto, parseInt(limit), parseInt(offset))
      .then(alertas => {
        res.status(200).json(alertas || [])
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  },

  marcarVisto: function (req, res) {
    const { alert_id } = req.params

    alertaService.marcarVisto(alert_id)
      .then(alerta => {
        if (!alerta) return res.status(404).json({ message: 'Alerta no encontrada' })
        res.status(200).json(alerta)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  eliminarAlerta: function (req, res) {
    const { alert_id } = req.params

    alertaService.eliminarAlerta(alert_id)
      .then(() => {
        res.status(200).json({ message: 'Alerta eliminada correctamente' })
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  }
}

module.exports = alertasController
