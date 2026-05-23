const inventarioService = require('../services/inventarioService')

const ingredientesController = {
  crearIngrediente: function (req, res) {
    const { ing_id, nombre, stock, u_medida, minimo } = req.body

    inventarioService.crearIngrediente(ing_id, nombre, stock, u_medida, minimo)
      .then(ingrediente => {
        res.status(201).json(ingrediente)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  obtenerIngredientes: function (req, res) {
    inventarioService.obtenerIngredientes()
      .then(ingredientes => {
        res.status(200).json(ingredientes || [])
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  },

  obtenerIngredientePorId: function (req, res) {
    const { ing_id } = req.params

    inventarioService.obtenerIngredientePorId(ing_id)
      .then(ingrediente => {
        res.status(200).json(ingrediente)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  actualizarIngrediente: function (req, res) {
    const { ing_id } = req.params
    const datos = req.body

    inventarioService.actualizarIngrediente(ing_id, datos)
      .then(ingrediente => {
        res.status(200).json(ingrediente)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  actualizarStock: function (req, res) {
    const { ing_id, cantidad } = req.body

    if (!ing_id || cantidad === undefined) {
      return res.status(400).json({ message: 'Datos incompletos' })
    }

    inventarioService.agregarStock(ing_id, cantidad)
      .then(ingrediente => {
        res.status(200).json(ingrediente)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  obtenerIngredientesCriticos: function (req, res) {
    inventarioService.obtenerIngredientesCriticos()
      .then(ingredientes => {
        res.status(200).json(ingredientes || [])
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  },

  eliminarIngrediente: function (req, res) {
    const { ing_id } = req.params

    inventarioService.eliminarIngrediente(ing_id)
      .then(ingrediente => {
        res.status(200).json({ message: 'Ingrediente eliminado exitosamente' })
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  }
}

module.exports = ingredientesController
