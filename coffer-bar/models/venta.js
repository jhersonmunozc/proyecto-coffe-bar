const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ventaSchema = new Schema({
  venta_id: { type: String, required: true, unique: true },
  barista_id: { type: String, required: true },
  productos: [
    {
      prod_id: { type: String, required: true },
      cantidad: { type: Number, required: true, min: 1 }
    }
  ],
  total: { type: Number, required: true },
  fecha: { type: Date, default: Date.now }
})

module.exports = mongoose.model('venta', ventaSchema, 'ventas')
