// routes/orders.js (exemplo de implementação)
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/order'); // Modelo de Order
const User = require('../models/user'); // Modelo de User
const Cart = require('../models/cart'); // Modelo de Cart
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para criar um novo pedido
router.post('/create', authMiddleware, async (req, res) => {
  const { cartItems, paymentMethod, cardNumber, cardName, total } = req.body;
  const userId = req.user.id; // Usuário autenticado
  
  try {
    // Criação de um novo pedido
    const newOrder = new Order({
      user: userId,
      items: cartItems,
      paymentMethod,
      cardNumber,
      cardName,
      total,
      status: 'pendente', // Inicia com status pendente
      createdAt: new Date(),
    });

    // Salvar pedido no banco de dados
    await newOrder.save();

    // Limpar o carrinho do usuário após o pagamento
    await Cart.updateOne({ user: userId }, { $set: { items: [] } });

    res.status(201).json({ message: 'Pedido realizado com sucesso!', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao realizar o pedido' });
  }
});

// Rota para listar pedidos do usuário (admin ou cliente)
router.get('/user-orders', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar todos os pedidos do usuário autenticado
    const orders = await Order.find({ user: userId }).populate('user', 'name email').exec();

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar os pedidos' });
  }
});

module.exports = router;
