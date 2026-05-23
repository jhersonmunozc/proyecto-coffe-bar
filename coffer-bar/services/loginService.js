const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')
require('dotenv').config()

const loginService = {
  login: function (email, password) {
    return Usuario.findOne({ email, activo: true }).exec()
      .then(usuario => {
        if (!usuario) {
          const err = new Error('Email o contraseña incorrectos')
          err.statusCode = 401
          throw err
        }

        return bcrypt.compare(password, usuario.password)
          .then(esValida => {
            if (!esValida) {
              const err = new Error('Email o contraseña incorrectos')
              err.statusCode = 401
              throw err
            }

            // Generar JWT
            const token = jwt.sign(
              { usuario_id: usuario.usuario_id, rol: usuario.rol },
              process.env.JWT_SECRET,
              { expiresIn: process.env.JWT_EXPIRATION }
            )

            // Actualizar última conexión
            return Usuario.findOneAndUpdate(
              { usuario_id: usuario.usuario_id },
              { ultimaConexion: new Date() },
              { returnDocument: 'after' }
            ).exec()
              .then(usuarioActualizado => {
                return {
                  token,
                  usuario: {
                    usuario_id: usuarioActualizado.usuario_id,
                    nombre: usuarioActualizado.nombre,
                    rol: usuarioActualizado.rol,
                    email: usuarioActualizado.email
                  }
                }
              })
          })
      })
  },

  verificarToken: function (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      return Promise.resolve(decoded)
    } catch (err) {
      const error = new Error('Token inválido o expirado')
      error.statusCode = 401
      return Promise.reject(error)
    }
  },

  logout: function (usuario_id) {
    // En este caso, el logout se maneja en cliente eliminando el token
    // Solo registramos que el usuario cerró sesión
    return Usuario.findOne({ usuario_id }).exec()
      .then(usuario => {
        if (!usuario) {
          const err = new Error('Usuario no encontrado')
          err.statusCode = 404
          throw err
        }
        return { message: 'Sesión cerrada exitosamente' }
      })
  },

  solicitarRecuperacion: function (email) {
    return Usuario.findOne({ email }).exec()
      .then(usuario => {
        if (!usuario) {
          // No revelar si el email existe por seguridad
          return { message: 'Si el email existe, se enviará instrucciones de recuperación' }
        }

        // Generar token temporal para recuperación (válido por 1 hora)
        const tokenRecuperacion = jwt.sign(
          { usuario_id: usuario.usuario_id },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        )

        // En producción, aquí se enviaría un email
        // Por ahora, retornamos el token (solo para desarrollo)
        return {
          message: 'Instrucciones enviadas al email',
          tokenRecuperacion // Solo en desarrollo
        }
      })
  },

  restablecerContraseña: function (token, nuevaContraseña) {
    if (!nuevaContraseña || nuevaContraseña.length < 6) {
      const err = new Error('La contraseña debe tener al menos 6 caracteres')
      err.statusCode = 400
      throw err
    }

    return this.verificarToken(token)
      .then(decoded => {
        return bcrypt.hash(nuevaContraseña, parseInt(process.env.BCRYPT_ROUNDS || 10))
          .then(passwordHasheada => {
            return Usuario.findOneAndUpdate(
              { usuario_id: decoded.usuario_id },
              { password: passwordHasheada },
              { returnDocument: 'after' }
            ).exec()
              .then(usuario => {
                if (!usuario) {
                  const err = new Error('Usuario no encontrado')
                  err.statusCode = 404
                  throw err
                }
                return { message: 'Contraseña actualizada exitosamente' }
              })
          })
      })
  }
}

module.exports = loginService
