const Receta = require('../models/receta')
const Producto = require('../models/producto')
const Ingrediente = require('../models/ingrediente')

const recetaService = {
  crearReceta: async function (prodId, ingredientes) {
    try {
      // Validar que producto existe
      const producto = await Producto.findOne({ prod_id: prodId }).exec()
      if (!producto) {
        const err = new Error('Producto no encontrado')
        err.statusCode = 404
        throw err
      }

      // Validar que ingredientes existan y cantidad > 0
      for (let ing of ingredientes) {
        const ingrediente = await Ingrediente.findOne({ ing_id: ing.ing_id }).exec()
        if (!ingrediente) {
          const err = new Error(`Ingrediente ${ing.ing_id} no encontrado`)
          err.statusCode = 404
          throw err
        }
        if (ing.cantidad <= 0) {
          const err = new Error('Cantidad must be greater than 0')
          err.statusCode = 400
          throw err
        }
      }

      const receta = new Receta()
      receta.prod_id = prodId
      receta.ingredientes = ingredientes
      
      return await receta.save()
    } catch (err) {
      throw err
    }
  },

  obtenerRecetas: function () {
    return Receta.find().exec()
  },

  obtenerRecetaPorProducto: function (prodId) {
    return Receta.findOne({ prod_id: prodId }).exec()
  },

  actualizarReceta: async function (prodId, ingredientes) {
    try {
      // Validar que ingredientes existan y cantidad > 0
      for (let ing of ingredientes) {
        const ingrediente = await Ingrediente.findOne({ ing_id: ing.ing_id }).exec()
        if (!ingrediente) {
          const err = new Error(`Ingrediente ${ing.ing_id} no encontrado`)
          err.statusCode = 404
          throw err
        }
        if (ing.cantidad <= 0) {
          const err = new Error('Cantidad must be greater than 0')
          err.statusCode = 400
          throw err
        }
      }

      const receta = await Receta.findOneAndUpdate(
        { prod_id: prodId },
        { ingredientes: ingredientes },
        { returnDocument: 'after' }
      ).exec()

      if (!receta) {
        const err = new Error('Receta no encontrada')
        err.statusCode = 404
        throw err
      }

      return receta
    } catch (err) {
      throw err
    }
  },

  eliminarReceta: async function (prodId) {
    try {
      const receta = await Receta.findOneAndDelete({ prod_id: prodId }).exec()
      
      if (!receta) {
        const err = new Error('Receta no encontrada')
        err.statusCode = 404
        throw err
      }

      return receta
    } catch (err) {
      throw err
    }
  }
}

module.exports = recetaService
