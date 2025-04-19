CREATE DATABASE IF NOT EXISTS sistema_produtos;
USE sistema_produtos;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  items JSONB,           -- Itens do pedido (pode ser um JSON com nome, quantidade, preço, etc.)
  payment_method VARCHAR(50), -- Método de pagamento (débito, crédito, etc.)
  card_number VARCHAR(20),   -- Número do cartão (com segurança, apenas os últimos 4 dígitos)
  card_name VARCHAR(255),    -- Nome no cartão
  total DECIMAL(10, 2),      -- Total do pedido
  status VARCHAR(50),        -- Status do pedido (ex: pendente, pago, cancelado)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  payment_method VARCHAR(20),
  card_number VARCHAR(20),
  card_name VARCHAR(100),
  total DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);





CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Inserir um usuário administrador padrão (senha: admin123)
INSERT INTO users (name, email, password, phone, address, role) 
VALUES (
    'Administrador',
    'admin@admin.com',
    '$2a$10$YourHashedPasswordHere', -- Substitua pelo hash real da senha
    '11999999999',
    'Endereço do Administrador',
    'admin'
); 