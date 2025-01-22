const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/auth');
const { validationResult } = require('express-validator');
const upload = require('../config/multer'); // Import multer configuration

exports.register = [
  upload.single('photoProfile'), // Use the multer middleware
  async (req, res) => {
    const { username, password, role, name, email } = req.body;
    const photoProfile = req.file ? req.file.filename : '';

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      User.create(username, hashedPassword, role, name, email, photoProfile, (err, result) => {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).send(err);
        }
        res.status(201).send(result);
      });
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).send('Server error');
    }
  }
];

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        photoProfile: user.photo_profile
      }
    };

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: jwtExpiresIn },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token, user: payload.user });
      }
    );
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Server error');
  }
};