const Venta = require('../models/venta')
const Receta = require('../models/receta')
const Ingrediente = require('../models/ingrediente')
const Alerta = require('../models/alerta')
const inventarioService = require('./inventarioService')
const alertaService = require('./alertaService')

const ventaService = {
  registrarVenta: async function (ventaId, baristaId, productos, total) {
    try {
      // Validar stock para todos los productos
      for (let prod of productos) {
        const receta = await Receta.findOne({ prod_id: prod.prod_id }).exec()
        if (!receta) throw new Error(`Receta no encontrada para ${prod.prod_id}`)

        for (let ing of receta.ingredientes) {
          const ingrediente = await Ingrediente.findOne({ ing_id: ing.ing_id }).exec()
          const stockNecesario = ing.cantidad * prod.cantidad
          if (!ingrediente || ingrediente.stock < stockNecesario) {
            throw new Error(`Stock insuficiente de ${ing.ing_id}`)
          }
        }
      }

      // Crear venta
      const venta = new Venta()
      venta.venta_id = ventaId
      venta.barista_id = baristaId
      venta.productos = productos
      venta.total = total

      // Array para coleccionar alertas generadas
      const alertasGeneradas = []

      // Descontar ingredientes y crear alertas
      for (let prod of productos) {
        const receta = await Receta.findOne({ prod_id: prod.prod_id }).exec()
        for (let ing of receta.ingredientes) {
          const stockADescontar = ing.cantidad * prod.cantidad
          await inventarioService.descontarStock(ing.ing_id, stockADescontar)

          // Crear alerta si stock es crítico
          const ingrediente = await Ingrediente.findOne({ ing_id: ing.ing_id }).exec()
          if (ingrediente.stock <= ingrediente.minimo) {
            const alerta = await alertaService.crearAlerta(ing.ing_id)
            alertasGeneradas.push(alerta)
          }
        }
      }

      // Guardar venta
      const ventaGuardada = await venta.save()

      // Retornar venta y alertas generadas
      return {
        venta: ventaGuardada,
        alertas: alertasGeneradas
      }
    } catch (err) {
      throw err
    }
  },

  obtenerVentas: async function (filtros = {}) {
    try {
      const query = {}
      if (filtros.fecha_inicio || filtros.fecha_fin) {
        query.fecha = {}
        if (filtros.fecha_inicio) query.fecha.$gte = new Date(filtros.fecha_inicio)
        if (filtros.fecha_fin) {
          const fin = new Date(filtros.fecha_fin)
          fin.setHours(23, 59, 59, 999)
          query.fecha.$lte = fin
        }
      }
      if (filtros.barista_id) query.barista_id = filtros.barista_id
      return Venta.find(query).sort({ fecha: -1 }).limit(200).exec()
    } catch (err) {
      throw err
    }
  },

  obtenerMisVentas: async function (baristaId, filtros = {}) {
    try {
      const query = { barista_id: baristaId }
      if (filtros.fecha_inicio || filtros.fecha_fin) {
        query.fecha = {}
        if (filtros.fecha_inicio) query.fecha.$gte = new Date(filtros.fecha_inicio)
        if (filtros.fecha_fin) {
          const fin = new Date(filtros.fecha_fin)
          fin.setHours(23, 59, 59, 999)
          query.fecha.$lte = fin
        }
      }
      return Venta.find(query).sort({ fecha: -1 }).exec()
    } catch (err) {
      throw err
    }
  },

  obtenerVentasDiarias: async function () {
    try {
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      const manana = new Date(hoy)
      manana.setDate(manana.getDate() + 1)

      const resultado = await Venta.aggregate([
        {
          $match: {
            fecha: { $gte: hoy, $lt: manana }
          }
        },
        {
          $group: {
            _id: null,
            totalDia: { $sum: '$total' },
            cantidadVentas: { $sum: 1 },
            promedioPorVenta: { $avg: '$total' }
          }
        }
      ]).exec()

      if (resultado.length === 0) {
        return {
          fecha: hoy.toISOString().split('T')[0],
          totalDia: 0,
          cantidadVentas: 0,
          promedioPorVenta: 0
        }
      }

      return {
        fecha: hoy.toISOString().split('T')[0],
        ...resultado[0]
      }
    } catch (err) {
      throw err
    }
  }
}

module.exports = ventaService
