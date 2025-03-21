const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth, isAdmin } = require('../middleware/auth');
const db = require('../config/database');

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const [products] = await db.promise().query('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
});

// Criar novo produto (apenas admin)
router.post('/', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const image = req.file ? req.file.filename : null;

    const [result] = await db.promise().query(
      'INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)',
      [name, description, price, image]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      description,
      price,
      image
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar produto' });
  }
});

// Atualizar produto (apenas admin)
router.put('/:id', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const image = req.file ? req.file.filename : req.body.image;

    await db.promise().query(
      'UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?',
      [name, description, price, image, id]
    );

    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
});

// Deletar produto (apenas admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.promise().query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar produto' });
  }
});

module.exports = router; 