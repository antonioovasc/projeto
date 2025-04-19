const db = require('../config/db');
const fs = require('fs').promises;
const path = require('path');

const productController = {
  // Listar todos os produtos
  getAllProducts: async (req, res) => {
    try {
      const [products] = await db.promise().query('SELECT * FROM products');
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar produtos' });
    }
  },

  // Obter um produto específico
  getProductById: async (req, res) => {
    try {
      const [product] = await db.promise().query(
        'SELECT * FROM products WHERE id = ?',
        [req.params.id]
      );

      if (!product[0]) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      res.json(product[0]);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar produto' });
    }
  },

  // Criar um novo produto
  createProduct: async (req, res) => {
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
  },

  // Atualizar um produto
  updateProduct: async (req, res) => {
    try {
      const { name, description, price } = req.body;
      const image = req.file ? req.file.filename : req.body.currentImage;

      // Se houver uma nova imagem, excluir a antiga
      if (req.file && req.body.currentImage) {
        const oldImagePath = path.join(__dirname, '../uploads', req.body.currentImage);
        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.error('Erro ao excluir imagem antiga:', error);
        }
      }

      await db.promise().query(
        'UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?',
        [name, description, price, image, req.params.id]
      );

      res.json({ message: 'Produto atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar produto' });
    }
  },

  // Excluir um produto
  deleteProduct: async (req, res) => {
    try {
      // Primeiro, buscar o produto para obter o nome da imagem
      const [product] = await db.promise().query(
        'SELECT image FROM products WHERE id = ?',
        [req.params.id]
      );

      if (!product[0]) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      // Excluir a imagem do servidor
      if (product[0].image) {
        const imagePath = path.join(__dirname, '../uploads', product[0].image);
        try {
          await fs.unlink(imagePath);
        } catch (error) {
          console.error('Erro ao excluir imagem:', error);
        }
      }

      // Excluir o produto do banco de dados
      await db.promise().query('DELETE FROM products WHERE id = ?', [req.params.id]);

      res.json({ message: 'Produto excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      res.status(500).json({ message: 'Erro ao excluir produto' });
    }
  }
};

module.exports = productController; 