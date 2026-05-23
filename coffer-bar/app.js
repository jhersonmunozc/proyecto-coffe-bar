const express = require('express')

const app = express()

// settings
app.set('port', process.env.PORT || 3000)

// middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// routes
const loginRoutes = require('./routes/login')
const productosRoutes = require('./routes/productos')
const ventasRoutes = require('./routes/ventas')
const alertasRoutes = require('./routes/alertas')
const ingredientesRoutes = require('./routes/ingredientes')
const recetasRoutes = require('./routes/recetas')
const usuariosRoutes = require('./routes/usuarios')

app.use('/api', loginRoutes)
app.use('/api/productos', productosRoutes)
app.use('/api/ventas', ventasRoutes)
app.use('/api/alertas', alertasRoutes)
app.use('/api/ingredientes', ingredientesRoutes)
app.use('/api/recetas', recetasRoutes)
app.use('/api/usuarios', usuariosRoutes)

// Error handler global - debe ir al final
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err)
  res.status(err.statusCode || 500).json({ message: err.message || 'Error interno del servidor' })
})

module.exports = app