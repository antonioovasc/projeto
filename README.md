# Sistema de Gerenciamento de Produtos

Sistema web para gerenciamento de produtos com funcionalidades específicas para administradores e usuários.

## Funcionalidades

- Login e registro de usuários
- Gerenciamento de produtos (cadastro, edição e exclusão) para administradores
- Visualização de produtos para usuários
- Carrinho de compras
- Integração com WhatsApp para finalização de pedidos

## Requisitos

- Node.js
- MySQL
- NPM ou Yarn

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Configure o banco de dados:
- Crie um banco de dados MySQL
- Execute o arquivo `database.sql` para criar as tabelas
- Configure as variáveis de ambiente no arquivo `.env`

4. Instale as dependências do frontend:
```bash
cd frontend
npm install
```

## Executando o Projeto

1. Inicie o servidor backend:
```bash
cd backend
npm run dev
```

2. Em outro terminal, inicie o frontend:
```bash
cd frontend
npm start
```

3. Acesse a aplicação em `http://localhost:3000`

## Estrutura do Projeto

```
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── database.sql
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Tecnologias Utilizadas

- Frontend:
  - React.js
  - React Router
  - Bootstrap
  - Axios
  - Font Awesome

- Backend:
  - Node.js
  - Express
  - MySQL
  - JWT
  - Multer

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. # testando
# projeto
