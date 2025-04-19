const express = require('express');
const router = express.Router();
const db = require('../config/db'); // ✅ CORRETO

// const Order = require('../models/order'); // pode comentar ou remover se não usar
const { auth } = require('../middleware/auth'); // Corrigido para 'auth'


// Rota para confirmar o pedido
router.post('/confirmar-pedido', auth, async (req, res) => { // Alterado de 'authMiddleware' para 'auth'
  const { orderId } = req.body; // Recebe o ID do pedido a ser confirmado
  try {
    // Encontrar o pedido pelo ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    // Verificar se o pedido já foi confirmado
    if (order.status === 'confirmado') {
      return res.status(400).json({ message: 'Este pedido já foi confirmado' });
    }

    // Atualizar o status do pedido para "confirmado"
    order.status = 'confirmado';
    await order.save();

    res.status(200).json({ message: 'Pedido confirmado com sucesso', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao confirmar o pedido' });
  }
});

module.exports = router;
