const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

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
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

/// Rota para recuperação de senha
router.post('/recover', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Verifique se o usuário existe com esse email
    const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (!user[0]) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Criptografe a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualize a senha do usuário no banco de dados
    await db.promise().query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

    res.status(200).json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar a senha' });
  }
});


// Rota de registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

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

    // Inserir o usuário no banco de dados
    await db.promise().query(
      'INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, address, 'user']
    );

    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
