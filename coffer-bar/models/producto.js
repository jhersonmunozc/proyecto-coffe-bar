const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productoSchema = new Schema({
  prod_id:    { type: String, required: true, unique: true },
  nombre:     { type: String, required: true },
  categoria:  { type: String, required: true },
  precio:     { type: Number, required: true },
  disponible: { type: Boolean, default: true },
  imagen_url: { type: String, default: '' }
})

module.exports = mongoose.model('producto', productoSchema, 'productos')
