const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [user] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user[0]) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user[0].id, role: user[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Rota de registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Verificar se o email já existe
    const [existingUser] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser[0]) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Verificar se o telefone já existe
    const [existingPhone] = await db.promise().query(
      'SELECT * FROM users WHERE phone = ?',
      [phone]
    );

    if (existingPhone[0]) {
      return res.status(400).json({ message: 'Telefone já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.promise().query(
      'INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, address, 'user']
    );

    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router; 