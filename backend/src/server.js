require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// --- 1. CONFIGURAÇÃO DO CORS ---
// Isso permite que o seu site na Hostinger acesse a API no Railway
app.use(cors({
  origin: '*', // Permite qualquer origem para teste inicial
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- 2. REMOÇÃO DE ESTÁTICOS ---
// Como o frontend agora está na Hostinger, o backend não precisa mais servir esses arquivos
// app.use(express.static(path.join(__dirname, '../../frontend'))); 

// --- 3. ROTA DE TESTE ---
app.get('/', (req, res) => {
  res.send('API EventHub funcionando!');
});

// --- 4. ROTAS DA API ---
const routes = require('./routes-sql');
app.use('/api', routes);

// --- 5. CONFIGURAÇÃO DA PORTA DINÂMICA ---
// O Railway define a porta automaticamente, por isso usamos process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Servidor rodando na porta ${PORT}`);
});