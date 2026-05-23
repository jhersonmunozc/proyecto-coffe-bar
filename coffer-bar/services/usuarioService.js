const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario')
require('dotenv').config()

const usuarioService = {
  verificarRol: function (usuario, rolRequired) {
    return usuario && usuario.rol === rolRequired
  },

  crearUsuario: function (usuario_id, nombre, rol, email, password) {
    if (!usuario_id || !nombre || !rol || !email || !password) {
      const err = new Error('Datos incompletos')
      err.statusCode = 400
      throw err
    }
    if (!['Barista', 'Administrador'].includes(rol)) {
      const err = new Error('Rol inválido. Debe ser Barista o Administrador')
      err.statusCode = 400
      throw err
    }
    if (password.length < 6) {
      const err = new Error('La contraseña debe tener al menos 6 caracteres')
      err.statusCode = 400
      throw err
    }

    return bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || 10))
      .then(passwordHasheada => {
        const usuario = new Usuario({
          usuario_id,
          nombre,
          rol,
          email,
          password: passwordHasheada
        })
        return usuario.save()
      })
  },

  obtenerUsuarios: function () {
    return Usuario.find().exec()
  },

  obtenerUsuarioPorId: function (usuario_id) {
    return Usuario.findOne({ usuario_id }).exec()
      .then(usuario => {
        if (!usuario) {
          const err = new Error('Usuario no encontrado')
          err.statusCode = 404
          throw err
        }
        return usuario
      })
  },

  actualizarUsuario: function (usuario_id, datos) {
    if (!datos || Object.keys(datos).length === 0) {
      const err = new Error('Datos de actualización requeridos')
      err.statusCode = 400
      throw err
    }
    if (datos.rol && !['Barista', 'Administrador'].includes(datos.rol)) {
      const err = new Error('Rol inválido. Debe ser Barista o Administrador')
      err.statusCode = 400
      throw err
    }
    
    // Si se actualiza contraseña, hashearla
    if (datos.password) {
      if (datos.password.length < 6) {
        const err = new Error('La contraseña debe tener al menos 6 caracteres')
        err.statusCode = 400
        throw err
      }
      return bcrypt.hash(datos.password, parseInt(process.env.BCRYPT_ROUNDS || 10))
        .then(passwordHasheada => {
          datos.password = passwordHasheada
          return Usuario.findOneAndUpdate(
            { usuario_id },
            datos,
            { returnDocument: 'after' }
          ).exec()
            .then(usuario => {
              if (!usuario) {
                const err = new Error('Usuario no encontrado')
                err.statusCode = 404
                throw err
              }
              return usuario
            })
        })
    }

    return Usuario.findOneAndUpdate(
      { usuario_id },
      datos,
      { returnDocument: 'after' }
    ).exec()
      .then(usuario => {
        if (!usuario) {
          const err = new Error('Usuario no encontrado')
          err.statusCode = 404
          throw err
        }
        return usuario
      })
  },

  eliminarUsuario: function (usuario_id) {
    return Usuario.findOneAndDelete({ usuario_id }).exec()
      .then(usuario => {
        if (!usuario) {
          const err = new Error('Usuario no encontrado')
          err.statusCode = 404
          throw err
        }
        return usuario
      })
  }
}

module.exports = usuarioService
