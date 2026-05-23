const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ingredienteSchema = new Schema({
  ing_id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  u_medida: { type: String, required: true },
  minimo: { type: Number, required: true }
})

module.exports = mongoose.model('ingrediente', ingredienteSchema, 'ingredientes')
