const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()

const Usuario = require('./models/usuario')

async function seedUsuarios() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        'mongodb://127.0.0.1:27017/db-sincronizacion-inventario'
    )
    console.log('✅ Conectado a MongoDB')

    // Limpiar colección
    await Usuario.deleteMany({})
    console.log('✅ Colección limpiada')

    // Hash de contraseñas
    const pass1 = await bcrypt.hash('password123', 10)
    const pass2 = await bcrypt.hash('admin123', 10)
    console.log('✅ Contraseñas hasheadas')

    // Crear usuarios nuevos
    const usuariosCreados = await Usuario.insertMany([
      {
        usuario_id: 'U001',
        nombre: 'Juan Barista',
        rol: 'Barista',
        email: 'juan@cafesino.com',
        password: pass1,
        activo: true,
        ultimaConexion: null
      },
      {
        usuario_id: 'U002',
        nombre: 'Admin Cafésino',
        rol: 'Administrador',
        email: 'admin@cafesino.com',
        password: pass2,
        activo: true,
        ultimaConexion: null
      }
    ])

    console.log('✅ Usuarios creados correctamente:')
    console.log('  1. Barista - juan@cafesino.com / password123')
    console.log('  2. Admin - admin@cafesino.com / admin123')
    
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

seedUsuarios()
