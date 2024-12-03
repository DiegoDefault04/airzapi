require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');  // Asegúrate de que esta línea esté al inicio
const datosRoutes = require('./routes/datos');
const propiedadesRoutes = require('./routes/propiedades');
// Crear la aplicación
const app = express();
// Middlewares
app.use(express.json()); // Reemplaza body-parser
app.use(cors());
app.use(morgan('dev'));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Rutas
app.use('/api/auth', authRoutes);  // Esto solo debe estar aquí una vez
app.use('/api/datos', datosRoutes);
app.use('/api', propiedadesRoutes);
// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch((err) => {
  console.error('Error al conectar a MongoDB:', err);
  process.exit(1); // Salir si hay un error crítico
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Error interno del servidor' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
