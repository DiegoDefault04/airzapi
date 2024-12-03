const express = require('express');
const router = express.Router();
const Dato = require('../models/Datos'); // Modelo que conecta con tu colección "datos"

// Ruta para obtener propiedades por ID
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

module.exports = router;
