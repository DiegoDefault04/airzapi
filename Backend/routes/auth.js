const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Ruta para registrar un usuario
router.post('/register', async (req, res) => {
  const { name, email, password, confirm_password } = req.body;

  // Verificar que las contraseñas coinciden
  if (password !== confirm_password) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }

    // Crear un nuevo usuario
    const newUser = new User({
      name,
      email,
      password,
    });

    // Guardar el usuario en la base de datos
    await newUser.save();

    res.status(201).json({ message: 'Usuario creado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al crear el usuario.' });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('Usuario no encontrado');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Contraseña incorrecta');

    const token = jwt.sign({ id: user._id }, 'secreto', { expiresIn: '1h' });
    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (err) {
    res.status(500).send('Error en el servidor');
  }
});


module.exports = router;
