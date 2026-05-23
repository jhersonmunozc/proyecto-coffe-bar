const recetaService = require('../services/recetaService')

const recetasController = {
  crearReceta: function (req, res) {
    const { prod_id, ingredientes } = req.body

    if (!prod_id || !ingredientes || ingredientes.length === 0) {
      return res.status(400).json({ message: 'Datos incompletos' })
    }

    recetaService.crearReceta(prod_id, ingredientes)
      .then(receta => {
        res.status(201).json(receta)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  obtenerRecetas: function (req, res) {
    recetaService.obtenerRecetas()
      .then(recetas => {
        res.status(200).json(recetas || [])
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  },

  obtenerRecetaPorProducto: function (req, res) {
    const { prod_id } = req.params

    recetaService.obtenerRecetaPorProducto(prod_id)
      .then(receta => {
        if (!receta) {
          return res.status(404).json({ message: 'Receta no encontrada' })
        }
        res.status(200).json(receta)
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  },

  actualizarReceta: function (req, res) {
    const { prod_id } = req.params
    const { ingredientes } = req.body

    if (!ingredientes || ingredientes.length === 0) {
      return res.status(400).json({ message: 'Ingredientes requeridos' })
    }

    recetaService.actualizarReceta(prod_id, ingredientes)
      .then(receta => {
        res.status(200).json(receta)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  eliminarReceta: function (req, res) {
    const { prod_id } = req.params

    recetaService.eliminarReceta(prod_id)
      .then(receta => {
        res.status(200).json({ message: 'Receta eliminada exitosamente' })
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  }
}

module.exports = recetasController
