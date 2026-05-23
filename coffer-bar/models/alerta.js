const mongoose = require('mongoose')
const Schema = mongoose.Schema

const alertaSchema = new Schema({
  alert_id: { type: String, required: true, unique: true },
  ing_id: { type: String, required: true },
  nivel: { type: String, enum: ['Bajo', 'Agotado', 'Crítico'], required: true },
  msj: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  visto: { type: Boolean, default: false }
})

module.exports = mongoose.model('alerta', alertaSchema, 'alertas')
