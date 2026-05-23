const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usuarioSchema = new Schema({
  usuario_id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  rol: { type: String, enum: ['Barista', 'Administrador'], required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  activo: { type: Boolean, default: true },
  ultimaConexion: { type: Date, default: null }
})

module.exports = mongoose.model('usuario', usuarioSchema, 'usuarios')
