const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // Conexão com o banco

// Importando todas as rotas usadas no frontend
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');

const app = express();

// Permitir requisições do frontend
// Aqui você pode permitir todas as origens ou apenas localhost:3000, se o frontend for local
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'] }));

app.use(express.json());

// Registrando as rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);

// Verificar a conexão com o banco de dados antes de iniciar o servidor
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
  
  // Porta do servidor
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
