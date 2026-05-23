const loginService = require('../services/loginService')

const loginController = {
  login: function (req, res) {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña requeridos' })
    }

    loginService.login(email, password)
      .then(resultado => {
        res.status(200).json(resultado)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  logout: function (req, res) {
    const { usuario_id } = req.usuario

    loginService.logout(usuario_id)
      .then(resultado => {
        res.status(200).json(resultado)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  solicitarRecuperacion: function (req, res) {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email requerido' })
    }

    loginService.solicitarRecuperacion(email)
      .then(resultado => {
        res.status(200).json(resultado)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  },

  restablecerContraseña: function (req, res) {
    const { token, nuevaContraseña } = req.body

    if (!token || !nuevaContraseña) {
      return res.status(400).json({ message: 'Token y nueva contraseña requeridos' })
    }

    loginService.restablecerContraseña(token, nuevaContraseña)
      .then(resultado => {
        res.status(200).json(resultado)
      })
      .catch(err => {
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ message: err.message })
      })
  }
}

module.exports = loginController
