const express = require('express');
const router = express.Router();
const Dato = require('../models/Datos');
const Counter = require('../models/Counter');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const Tabla = require('../models/Tabla');

// Ruta para eliminar una tabla por ID
router.delete('/eliminar-tabla/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Dato.findOneAndDelete({ ID: id });
    if (!resultado) return res.status(404).json({ error: 'Tabla no encontrada' });

    res.status(200).json({ message: 'Tabla eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la tabla:', error);
    res.status(500).json({ error: 'Error al eliminar la tabla' });
  }
});

// Ruta para obtener las tablas de la base de datos
router.get('/obtener-tablas', async (req, res) => {
  try {
    const tablas = await Dato.find({}, { ID: 1, NombreVivienda: 1 }); // Selecciona solo los campos relevantes
    res.status(200).json(tablas);
  } catch (error) {
    console.error('Error al obtener las tablas:', error);
    res.status(500).json({ error: 'Error al obtener las tablas' });
  }
});

// Ruta para guardar datos
router.post('/registrocasa', async (req, res) => {
  console.log('Datos recibidos:', req.body); // Para verificar los datos enviados
  try {
      const nuevoDato = new Dato(req.body);
      const datoGuardado = await nuevoDato.save();
      res.status(201).json(datoGuardado);
  } catch (error) {
      console.error('Error al guardar datos:', error);
      res.status(500).json({ error: 'Error al guardar datos' });
  }
});


// Ruta para guardar datos
router.get('/propiedades/:id', async (req, res) => {
  try {
    const { id } = req.params; // ID que se pasa en la URL
    const propiedades = await Dato.find({ ID: id }); // Filtra por ID
    res.json(propiedades); // Responde con las propiedades encontradas
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    res.status(500).json({ error: 'Error al obtener propiedades' });
  }
});

router.get('/generar-csv', async (req, res) => {
  try {
    const tablas = await Tabla.find();
    if (!tablas.length) {
      return res.status(404).send('No hay datos disponibles');
    }

    const fields = [
      'ID', 'NombreVivienda', 'TipoVivienda', 'Estado', 'Habitaciones', 'Baños', 'Muebles',
      'Precio', 'SuperficieTotal', 'SuperficieUtil', 'PrecioPorMetroCuadrado', 'CertificadoEnergetico',
      'AñoConstruccion', 'UbicacionCalle', 'UbicacionPiso', 'CodigoPostal', 'Localidad', 'Provincia',
      'Distrito', 'Barrio', 'GastosComunidad', 'Calefaccion', 'Garage', 'Trastero', 'BalconTerraza',
      'Piscina', 'Jardin', 'Planta', 'Ascensor', 'Orientacion', 'NotaAgente',
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(tablas);

    // Define la ruta del archivo CSV
    const folderPath = path.join(__dirname, '../csv');
    const filePath = path.join(folderPath, 'tablas.csv');

    // Verifica si la carpeta existe, si no, la crea
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Escribe el archivo CSV
    fs.writeFileSync(filePath, csv);

    // Envía el archivo como descarga
    res.download(filePath, 'tablas.csv', (err) => {
      if (err) {
        console.error('Error al enviar el archivo:', err);
      }
    });
  } catch (error) {
    console.error('Error al generar el CSV:', error);
    res.status(500).send('Error al generar el CSV');
  }
});

module.exports = router;