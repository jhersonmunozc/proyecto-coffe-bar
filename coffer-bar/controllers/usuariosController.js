const usuarioService = require('../services/usuarioService')

const usuariosController = {
  crearUsuario: function (req, res) {
    const { usuario_id, nombre, rol, email, password } = req.body

    usuarioService.crearUsuario(usuario_id, nombre, rol, email, password)
      .then(usuario => {
        res.status(201).json(usuario)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  obtenerUsuarios: function (req, res) {
    usuarioService.obtenerUsuarios()
      .then(usuarios => {
        res.status(200).json(usuarios || [])
      })
      .catch(err => res.status(500).json({ message: `Error: ${err.message}` }))
  },

  obtenerUsuarioPorId: function (req, res) {
    const { usuario_id } = req.params

    usuarioService.obtenerUsuarioPorId(usuario_id)
      .then(usuario => {
        res.status(200).json(usuario)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  actualizarUsuario: function (req, res) {
    const { usuario_id } = req.params
    const datos = req.body

    usuarioService.actualizarUsuario(usuario_id, datos)
      .then(usuario => {
        res.status(200).json(usuario)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  eliminarUsuario: function (req, res) {
    const { usuario_id } = req.params

    usuarioService.eliminarUsuario(usuario_id)
      .then(usuario => {
        res.status(200).json({ message: 'Usuario eliminado exitosamente' })
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  }
}

module.exports = usuariosController
