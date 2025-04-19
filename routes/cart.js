const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const db = require('../config/db');



// Adicionar item ao carrinho
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Verificar se o produto existe
    const [product] = await db.promise().query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );

    if (!product[0]) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Verificar se o item já está no carrinho
    const [existingItem] = await db.promise().query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existingItem[0]) {
      // Atualizar quantidade
      await db.promise().query(
        'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId]
      );
    } else {
      // Adicionar novo item
      await db.promise().query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
    }

    res.json({ message: 'Item adicionado ao carrinho com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar item ao carrinho' });
  }
});

// Obter itens do carrinho
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [cartItems] = await db.promise().query(
      `SELECT c.*, p.name, p.price, p.image 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [userId]
    );

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar itens do carrinho' });
  }
});

// Atualizar quantidade do item no carrinho
router.put('/update/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    await db.promise().query(
      'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    );

    res.json({ message: 'Quantidade atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar quantidade' });
  }
});

// Remover item do carrinho
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    await db.promise().query(
      'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    res.json({ message: 'Item removido do carrinho com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover item do carrinho' });
  }
});

// Limpar carrinho
router.delete('/clear', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    await db.promise().query(
      'DELETE FROM cart WHERE user_id = ?',
      [userId]
    );

    res.json({ message: 'Carrinho limpo com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao limpar carrinho' });
  }
});

module.exports = router; 