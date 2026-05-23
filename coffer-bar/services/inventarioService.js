const Ingrediente = require('../models/ingrediente')
const Receta      = require('../models/receta')
const productoService = require('./productoService')

const inventarioService = {
  descontarStock: function (ingId, cantidad) {
    return Ingrediente.findOne({ ing_id: ingId }).exec()
      .then(ing => {
        if (!ing) throw new Error('Ingrediente no encontrado')
        const stockFinal = ing.stock - cantidad
        if (stockFinal < 0) {
          const err = new Error(`Stock insuficiente de ${ingId}`)
          err.statusCode = 422
          throw err
        }
        return Ingrediente.findOneAndUpdate(
          { ing_id: ingId },
          { $inc: { stock: -cantidad } },
          { returnDocument: 'after' }
        ).exec()
      })
  },

  agregarStock: function (ingId, cantidad) {
    return Ingrediente.findOne({ ing_id: ingId }).exec()
      .then(ing => {
        if (!ing) {
          const err = new Error('Ingrediente no encontrado')
          err.statusCode = 404
          throw err
        }
        const stockFinal = ing.stock + cantidad
        if (stockFinal < 0) {
          const err = new Error('Stock no puede ser negativo')
          err.statusCode = 422
          throw err
        }
        return Ingrediente.findOneAndUpdate(
          { ing_id: ingId },
          { $inc: { stock: cantidad } },
          { returnDocument: 'after' }
        ).exec()
      })
  },

  obtenerIngredientesCriticos: function () {
    return Ingrediente.find({ $expr: { $lte: ['$stock', '$minimo'] } }).exec()
  },

  crearIngrediente: function (ing_id, nombre, stock, u_medida, minimo) {
    if (!ing_id || !nombre || stock === undefined || !u_medida || minimo === undefined) {
      const err = new Error('Datos incompletos')
      err.statusCode = 400
      throw err
    }
    if (stock < 0 || minimo < 0) {
      const err = new Error('Stock y minimo no pueden ser negativos')
      err.statusCode = 400
      throw err
    }
    const ingrediente = new Ingrediente({
      ing_id,
      nombre,
      stock,
      u_medida,
      minimo
    })
    return ingrediente.save()
  },

  obtenerIngredientes: function () {
    return Ingrediente.find().exec()
  },

  obtenerIngredientePorId: function (ing_id) {
    return Ingrediente.findOne({ ing_id }).exec()
      .then(ing => {
        if (!ing) {
          const err = new Error('Ingrediente no encontrado')
          err.statusCode = 404
          throw err
        }
        return ing
      })
  },

  actualizarIngrediente: function (ing_id, datos) {
    if (!datos || Object.keys(datos).length === 0) {
      const err = new Error('Datos de actualización requeridos')
      err.statusCode = 400
      throw err
    }
    if (datos.stock !== undefined && datos.stock < 0) {
      const err = new Error('Stock no puede ser negativo')
      err.statusCode = 400
      throw err
    }
    if (datos.minimo !== undefined && datos.minimo < 0) {
      const err = new Error('Minimo no puede ser negativo')
      err.statusCode = 400
      throw err
    }
    return Ingrediente.findOneAndUpdate(
      { ing_id },
      datos,
      { returnDocument: 'after' }
    ).exec()
      .then(ing => {
        if (!ing) {
          const err = new Error('Ingrediente no encontrado')
          err.statusCode = 404
          throw err
        }
        return ing
      })
  },

  eliminarIngrediente: async function (ing_id) {
    const recetasConIng = await Receta.find({ 'ingredientes.ing_id': ing_id }).exec()
    if (recetasConIng.length > 0) {
      const err = new Error(`No se puede eliminar: el ingrediente esta en uso en ${recetasConIng.length} receta(s)`)
      err.statusCode = 409
      throw err
    }
    const ing = await Ingrediente.findOneAndDelete({ ing_id }).exec()
    if (!ing) {
      const err = new Error('Ingrediente no encontrado')
      err.statusCode = 404
      throw err
    }
    return ing
  }
}

module.exports = inventarioService
