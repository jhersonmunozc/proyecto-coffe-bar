const jwt = require('jsonwebtoken')
require('dotenv').config()

const autenticacionService = {
  verificarToken: function (req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ message: 'Token requerido' })
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.usuario = decoded
      next()
    } catch (err) {
      return res.status(401).json({ message: 'Token invalido o expirado' })
    }
  },

  verificarRol: function (usuario, rolRequired) {
    return usuario && usuario.rol === rolRequired
  },

  verifyBarista: function (req, res, next) {
    if (!autenticacionService.verificarRol(req.usuario, 'Barista')) {
      return res.status(403).json({ message: 'Solo Baristas pueden registrar ventas' })
    }
    next()
  },

  verifyAdmin: function (req, res, next) {
    if (!autenticacionService.verificarRol(req.usuario, 'Administrador')) {
      return res.status(403).json({ message: 'Solo Administradores pueden realizar esta acción' })
    }
    next()
  }
}

module.exports = autenticacionService
