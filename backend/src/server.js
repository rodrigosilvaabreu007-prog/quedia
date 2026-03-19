require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Configuração do CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK',
    mensagem: 'API EventHub funcionando!',
    versao: '1.0.0'
  });
});

// Rotas da API
const routes = require('./routes-sql');
app.use('/api', routes);

// Configuração da porta
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`✓ Servidor rodando em http://${HOST}:${PORT}`);
  console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
});