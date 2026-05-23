/**
 * Seed demo completo — alinea campos con models/*.js
 *
 * Colecciones: usuarios, ingredientes, productos, recetas, alertas, ventas
 *
 * Credenciales:
 *   Barista  → juan@cafesino.com / password123
 *   Admin    → admin@cafesino.com / admin123
 *
 * Menú público: P001 Waffle, P004 Americano (stock crítico en café y leche)
 * Panel admin: alertas, KPI ventas, inventario completo
 */
require('dotenv').config()

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Usuario = require('./models/usuario')
const Ingrediente = require('./models/ingrediente')
const Producto = require('./models/producto')
const Receta = require('./models/receta')
const Alerta = require('./models/alerta')
const Venta = require('./models/venta')

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/db-sincronizacion-inventario'

async function seedDemo() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Conectado a MongoDB')

    await Promise.all([
      Venta.deleteMany({}),
      Alerta.deleteMany({}),
      Receta.deleteMany({}),
      Producto.deleteMany({}),
      Ingrediente.deleteMany({}),
      Usuario.deleteMany({}),
    ])
    console.log('✅ Colecciones limpiadas')

    const passBarista = await bcrypt.hash('password123', 10)
    const passAdmin = await bcrypt.hash('admin123', 10)

    await Usuario.insertMany([
      {
        usuario_id: 'U001',
        nombre: 'Juan Barista',
        rol: 'Barista',
        email: 'juan@cafesino.com',
        password: passBarista,
        activo: true,
        ultimaConexion: null,
      },
      {
        usuario_id: 'U002',
        nombre: 'Admin Cafésino',
        rol: 'Administrador',
        email: 'admin@cafesino.com',
        password: passAdmin,
        activo: true,
        ultimaConexion: null,
      },
    ])
    console.log('✅ Usuarios (2)')

    await Ingrediente.insertMany([
      { ing_id: 'I001', nombre: 'Queso Costeño', stock: 5000, u_medida: 'ml', minimo: 1000 },
      { ing_id: 'I002', nombre: 'Almidón', stock: 5000, u_medida: 'ml', minimo: 1000 },
      { ing_id: 'I003', nombre: 'Harina de Maíz', stock: 2000, u_medida: 'g', minimo: 500 },
      { ing_id: 'I004', nombre: 'Mantequilla', stock: 1000, u_medida: 'g', minimo: 200 },
      // stock <= minimo → alerta A100; productos con café quedan no disponibles en menú
      { ing_id: 'I005', nombre: 'Café en grano', stock: 480, u_medida: 'g', minimo: 500 },
      // stock = 0 → alerta A101; Capuccino y Glaciado no disponibles
      { ing_id: 'I006', nombre: 'Leche', stock: 0, u_medida: 'ml', minimo: 2000 },
      { ing_id: 'I007', nombre: 'Helado Vainilla', stock: 2000, u_medida: 'g', minimo: 500 },
      { ing_id: 'I008', nombre: 'Crema Chantilly', stock: 50, u_medida: 'u', minimo: 5 },
    ])
    console.log('✅ Ingredientes (8)')

    await Producto.insertMany([
      {
        prod_id: 'P001',
        nombre: 'Waffle Tradicional',
        categoria: 'Comida',
        precio: 12000,
        disponible: true,
        imagen_url: '',
      },
      {
        prod_id: 'P002',
        nombre: 'Capuccino',
        categoria: 'Bebida',
        precio: 7000,
        disponible: true,
        imagen_url: '',
      },
      {
        prod_id: 'P003',
        nombre: 'Glaciado de Café',
        categoria: 'Bebida',
        precio: 9500,
        disponible: true,
        imagen_url: '',
      },
      {
        prod_id: 'P004',
        nombre: 'Americano',
        categoria: 'Bebida',
        precio: 4500,
        disponible: true,
        imagen_url: '',
      },
    ])
    console.log('✅ Productos (4)')

    await Receta.insertMany([
      {
        prod_id: 'P001',
        ingredientes: [
          { ing_id: 'I001', cantidad: 142.85 },
          { ing_id: 'I002', cantidad: 142.85 },
          { ing_id: 'I003', cantidad: 35.71 },
          { ing_id: 'I004', cantidad: 17.85 },
        ],
      },
      {
        prod_id: 'P002',
        ingredientes: [
          { ing_id: 'I006', cantidad: 140 },
          { ing_id: 'I005', cantidad: 7 },
          { ing_id: 'I008', cantidad: 1 },
        ],
      },
      {
        prod_id: 'P003',
        ingredientes: [
          { ing_id: 'I005', cantidad: 12 },
          { ing_id: 'I006', cantidad: 200 },
          { ing_id: 'I007', cantidad: 80 },
        ],
      },
      {
        prod_id: 'P004',
        ingredientes: [{ ing_id: 'I005', cantidad: 9 }],
      },
    ])
    console.log('✅ Recetas (4)')

    await Alerta.insertMany([
      {
        alert_id: 'A100',
        ing_id: 'I005',
        nivel: 'Bajo',
        msj: 'Insumo Crítico: Café por debajo de 500g',
        fecha: new Date('2026-03-08T09:00:00Z'),
        visto: false,
      },
      {
        alert_id: 'A101',
        ing_id: 'I006',
        nivel: 'Agotado',
        msj: 'Leche insuficiente para preparar Capuccinos',
        fecha: new Date('2026-03-08T11:30:00Z'),
        visto: false,
      },
    ])
    console.log('✅ Alertas (2)')

    await Venta.insertMany([
      {
        venta_id: 'V001',
        barista_id: 'U001',
        productos: [{ prod_id: 'P004', cantidad: 3 }],
        total: 13500,
        fecha: new Date('2026-03-08T10:00:00Z'),
      },
      {
        venta_id: 'V002',
        barista_id: 'U001',
        productos: [{ prod_id: 'P001', cantidad: 2 }],
        total: 24000,
        fecha: new Date('2026-03-08T11:00:00Z'),
      },
      {
        venta_id: 'V003',
        barista_id: 'U001',
        productos: [
          { prod_id: 'P004', cantidad: 1 },
          { prod_id: 'P001', cantidad: 1 },
        ],
        total: 16500,
        fecha: new Date('2026-03-08T12:30:00Z'),
      },
    ])
    console.log('✅ Ventas demo (3) — KPI top: P004 (4 uds)')

    console.log('\n📋 Resumen demo:')
    console.log('  Login barista: juan@cafesino.com / password123')
    console.log('  Login admin:   admin@cafesino.com / admin123')
    console.log('  Menú público:  P001 Waffle disponible (café/leche en alerta)')
    console.log('  Alertas:       A100 (café bajo), A101 (leche agotada)')

    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

seedDemo()
