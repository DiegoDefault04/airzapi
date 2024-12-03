const mongoose = require('mongoose');
const Tabla = require('./models/Tabla'); // Ajusta la ruta según tu estructura

mongoose.connect('mongodb://localhost:27017/airzdata', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function test() {
  try {
    const tablas = await Tabla.find();
    console.log(tablas);
  } catch (error) {
    console.error('Error al obtener tablas:', error);
  } finally {
    mongoose.connection.close();
  }
}

test();
