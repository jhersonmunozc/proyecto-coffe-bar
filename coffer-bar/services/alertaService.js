const Alerta = require('../models/alerta')
const Ingrediente = require('../models/ingrediente')

const alertaService = {
  crearAlerta: function (ingId) {
    return Ingrediente.findOne({ ing_id: ingId }).exec()
      .then(ing => {
        if (!ing) throw new Error('Ingrediente no encontrado')

        const alerta = new Alerta()
        alerta.alert_id = `A${Date.now()}${Math.random()}`
        alerta.ing_id = ingId
        alerta.nivel = ing.stock === 0 ? 'Agotado' : 'Bajo'
        alerta.msj = `Stock crítico: ${ing.nombre} (${ing.stock}${ing.u_medida})`
        
        return alerta.save()
      })
      .catch(err => Promise.reject(err))
  },

  obtenerAlertas: function () {
    return Alerta.find({ visto: false }).sort({ fecha: -1 }).exec()
  },

  marcarVisto: function (alertId) {
    return Alerta.findOneAndUpdate(
      { alert_id: alertId },
      { visto: true },
      { returnDocument: 'after' }
    ).exec()
  },

  eliminarAlerta: function (alertId) {
    return Alerta.findOneAndDelete({ alert_id: alertId }).exec()
      .then(alerta => {
        if (!alerta) {
          const err = new Error('Alerta no encontrada')
          err.statusCode = 404
          throw err
        }
        return alerta
      })
  },

  obtenerHistorialAlertas: function (visto, limit = 50, offset = 0) {
    let query = {}
    
    if (visto !== undefined && visto !== null) {
      query.visto = visto === 'true' || visto === true
    }

    return Alerta.find(query)
      .sort({ fecha: -1 })
      .limit(limit)
      .skip(offset)
      .exec()
  }
}

module.exports = alertaService
