const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recetaSchema = new Schema({
  prod_id: { type: String, required: true, unique: true },
  ingredientes: [
    {
      ing_id: { type: String, required: true },
      cantidad: { type: Number, required: true }
    }
  ]
})

module.exports = mongoose.model('receta', recetaSchema, 'recetas')
