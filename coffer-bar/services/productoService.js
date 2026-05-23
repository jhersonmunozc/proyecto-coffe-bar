const Producto = require('../models/producto')
const Receta = require('../models/receta')
const Ingrediente = require('../models/ingrediente')
const Venta = require('../models/venta')

const productoService = {
  obtenerProductosDisponibles: async function () {
      const productos = await Producto.find({ disponible: true }).exec()
      const disponibles = []
      const noDisponibles = []
      
      for (let producto of productos) {
        const receta = await Receta.findOne({ prod_id: producto.prod_id }).exec()
        
        if (!receta) {
          noDisponibles.push({
            prod_id: producto.prod_id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            precio: producto.precio,
            razon: "Sin receta definida"
          })
          continue
        }
        
        let ingredienteBajo = null
        for (let ingrediente of receta.ingredientes) {
          const ing = await Ingrediente.findOne({ ing_id: ingrediente.ing_id }).exec()
          if (!ing || ing.stock <= ing.minimo) {
            ingredienteBajo = {
              nombre: ing ? ing.nombre : "Desconocido",
              stock: ing ? ing.stock : 0,
              minimo: ing ? ing.minimo : 0
            }
            break
          }
        }
        
        if (ingredienteBajo) {
          noDisponibles.push({
            prod_id: producto.prod_id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            precio: producto.precio,
            razon: `Stock bajo: ${ingredienteBajo.nombre} (${ingredienteBajo.stock}/${ingredienteBajo.minimo})`
          })
        } else {
          disponibles.push(producto)
        }
      }
      
      return { disponibles, noDisponibles }
  },

  obtenerProductosDisponiblesPorCategoria: async function (categoria) {
      const regex = new RegExp(`^${categoria}$`, 'i')
      const productos = await Producto.find({ disponible: true, categoria: regex }).exec()
      const disponibles = []
      const noDisponibles = []
      
      for (let producto of productos) {
        const receta = await Receta.findOne({ prod_id: producto.prod_id }).exec()
        
        if (!receta) {
          noDisponibles.push({
            prod_id: producto.prod_id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            precio: producto.precio,
            razon: "Sin receta definida"
          })
          continue
        }
        
        let ingredienteBajo = null
        for (let ingrediente of receta.ingredientes) {
          const ing = await Ingrediente.findOne({ ing_id: ingrediente.ing_id }).exec()
          if (!ing || ing.stock <= ing.minimo) {
            ingredienteBajo = {
              nombre: ing ? ing.nombre : "Desconocido",
              stock: ing ? ing.stock : 0,
              minimo: ing ? ing.minimo : 0
            }
            break
          }
        }
        
        if (ingredienteBajo) {
          noDisponibles.push({
            prod_id: producto.prod_id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            precio: producto.precio,
            razon: `Stock bajo: ${ingredienteBajo.nombre} (${ingredienteBajo.stock}/${ingredienteBajo.minimo})`
          })
        } else {
          disponibles.push(producto)
        }
      }
      
      return { disponibles, noDisponibles }
  },

  actualizarDisponibilidad: function (prodId, disponible) {
    return Producto.findOneAndUpdate(
      { prod_id: prodId },
      { disponible: disponible },
      { returnDocument: 'after' }
    ).exec()
  },

  verificarDisponibilidad: async function (prodId) {
    try {
      const receta = await Receta.findOne({ prod_id: prodId }).exec()
      if (!receta) return false

      for (let ingrediente of receta.ingredientes) {
        const ing = await Ingrediente.findOne({ ing_id: ingrediente.ing_id }).exec()
        if (!ing || ing.stock <= ing.minimo) {
          return false
        }
      }
      return true
    } catch (err) {
      return false
    }
  },

  obtenerProductoTopVendido: async function () {
    try {
      const resultado = await Venta.aggregate([
        { $unwind: '$productos' },
        {
          $group: {
            _id: '$productos.prod_id',
            totalVendido: { $sum: '$productos.cantidad' }
          }
        },
        { $sort: { totalVendido: -1 } },
        { $limit: 1 }
      ]).exec()

      if (resultado.length === 0) {
        return null
      }

      const prodId = resultado[0]._id
      const totalVendido = resultado[0].totalVendido

      const producto = await Producto.findOne({ prod_id: prodId }).exec()
      
      if (!producto) {
        return null
      }

      return {
        prod_id: producto.prod_id,
        nombre: producto.nombre,
        precio: producto.precio,
        totalVendido: totalVendido,
        ingresoTotal: producto.precio * totalVendido
      }
    } catch (err) {
      throw err
    }
  },

  crearProducto: async function (prodId, nombre, categoria, precio) {
    try {
      if (!prodId || !nombre || !categoria || precio === undefined) {
        const err = new Error('Datos incompletos')
        err.statusCode = 400
        throw err
      }

      if (precio <= 0) {
        const err = new Error('Precio debe ser mayor a 0')
        err.statusCode = 400
        throw err
      }

      // Verificar que prod_id no exista
      const existente = await Producto.findOne({ prod_id: prodId }).exec()
      if (existente) {
        const err = new Error('Producto con este ID ya existe')
        err.statusCode = 409
        throw err
      }

      const producto = new Producto()
      producto.prod_id = prodId
      producto.nombre = nombre
      producto.categoria = categoria
      producto.precio = precio
      producto.disponible = true

      return await producto.save()
    } catch (err) {
      throw err
    }
  },

  obtenerProductos: function () {
    return Producto.find().exec()
  },

  obtenerProductoPorId: async function (prodId) {
    try {
      const producto = await Producto.findOne({ prod_id: prodId }).exec()
      
      if (!producto) {
        const err = new Error('Producto no encontrado')
        err.statusCode = 404
        throw err
      }

      return producto
    } catch (err) {
      throw err
    }
  },

  actualizarProducto: async function (prodId, datos) {
    try {
      if (!datos || Object.keys(datos).length === 0) {
        const err = new Error('Debe proporcionar al menos un dato para actualizar')
        err.statusCode = 400
        throw err
      }

      // Validar que no cambien campos sensibles
      if (datos.prod_id) {
        const err = new Error('No se puede modificar el producto ID')
        err.statusCode = 400
        throw err
      }

      // Validar precio si se proporciona
      if (datos.precio !== undefined && datos.precio <= 0) {
        const err = new Error('Precio debe ser mayor a 0')
        err.statusCode = 400
        throw err
      }

      const producto = await Producto.findOneAndUpdate(
        { prod_id: prodId },
        datos,
        { returnDocument: 'after' }
      ).exec()

      if (!producto) {
        const err = new Error('Producto no encontrado')
        err.statusCode = 404
        throw err
      }

      return producto
    } catch (err) {
      throw err
    }
  },

  eliminarProducto: async function (prodId) {
    try {
      // Verificar que no haya receta asociada
      const receta = await Receta.findOne({ prod_id: prodId }).exec()
      if (receta) {
        const err = new Error('No se puede eliminar producto con receta existente')
        err.statusCode = 409
        throw err
      }

      const producto = await Producto.findOneAndDelete({ prod_id: prodId }).exec()

      if (!producto) {
        const err = new Error('Producto no encontrado')
        err.statusCode = 404
        throw err
      }

      return producto
    } catch (err) {
      throw err
    }
  }
}

module.exports = productoService
