const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const db = require('../config/database');
const bcrypt = require('bcrypt');

// Listar todos os usuários (apenas admin)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const [users] = await db.promise().query(
      'SELECT id, name, email, phone, address, role, created_at FROM users'
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
});

// Obter dados do usuário atual
router.get('/me', auth, async (req, res) => {
  try {
    const [user] = await db.promise().query(
      'SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user[0]) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar dados do usuário' });
  }
});

// Atualizar dados do usuário
router.put('/me', auth, async (req, res) => {
  const { name, phone, address } = req.body;

  // Validação simples para garantir que os campos obrigatórios estão presentes
  if (!name || !phone || !address) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    await db.promise().query(
      'UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?',
      [name, phone, address, req.user.id]
    );
    res.json({ message: 'Dados atualizados com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar dados do usuário' });
  }
});

// Atualizar senha do usuário
router.put('/me/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validação para garantir que as senhas sejam fornecidas
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias. A nova senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    // Verificar se a senha atual está correta
    const [user] = await db.promise().query(
      'SELECT password FROM users WHERE id = ?',
      [req.user.id]
    );

    const validPassword = await bcrypt.compare(currentPassword, user[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Senha atual incorreta' });
    }

    // Atualizar a senha do usuário
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.promise().query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar senha' });
  }
});

// Excluir usuário (apenas admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Não permitir que o usuário exclua a si mesmo
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Não é possível excluir seu próprio usuário' });
    }

    // Excluir o usuário
    await db.promise().query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir usuário' });
  }
});

module.exports = router;
