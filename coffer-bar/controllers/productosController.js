const productoService = require('../services/productoService')

const productosController = {
  obtenerMenu: function (req, res) {
    const { categoria } = req.query

    if (categoria) {
      // Filtrado por categoría - Consulta 9
      productoService.obtenerProductosDisponiblesPorCategoria(categoria)
        .then(resultado => {
          if ((!resultado.disponibles || resultado.disponibles.length === 0) &&
              (!resultado.noDisponibles || resultado.noDisponibles.length === 0)) {
            return res.status(200).json({
              message: `No hay productos disponibles en la categoría ${categoria}`,
              disponibles: [],
              noDisponibles: []
            })
          }
          res.status(200).json(resultado)
        })
        .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
    } else {
      // Menú completo - Consulta 1
      productoService.obtenerProductosDisponibles()
        .then(resultado => {
          if ((!resultado.disponibles || resultado.disponibles.length === 0) &&
              (!resultado.noDisponibles || resultado.noDisponibles.length === 0)) {
            return res.status(200).json({
              message: 'No hay productos disponibles en el menú',
              disponibles: [],
              noDisponibles: []
            })
          }
          res.status(200).json(resultado)
        })
        .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
    }
  },

  obtenerProductoTopVendido: function (req, res) {
    productoService.obtenerProductoTopVendido()
      .then(producto => {
        if (!producto) {
          return res.status(200).json(null)
        }
        res.status(200).json(producto)
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  },

  crearProducto: function (req, res) {
    const { prod_id, nombre, categoria, precio } = req.body

    productoService.crearProducto(prod_id, nombre, categoria, precio)
      .then(producto => {
        res.status(201).json(producto)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  obtenerProductos: function (req, res) {
    productoService.obtenerProductos()
      .then(productos => {
        res.status(200).json(productos || [])
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  },

  obtenerProductoPorId: function (req, res) {
    const { prod_id } = req.params

    productoService.obtenerProductoPorId(prod_id)
      .then(producto => {
        res.status(200).json(producto)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  actualizarProducto: function (req, res) {
    const { prod_id } = req.params
    const datos = req.body

    productoService.actualizarProducto(prod_id, datos)
      .then(producto => {
        res.status(200).json(producto)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  eliminarProducto: function (req, res) {
    const { prod_id } = req.params

    productoService.eliminarProducto(prod_id)
      .then(producto => {
        res.status(200).json({ message: 'Producto eliminado exitosamente' })
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  }
}

module.exports = productosController
