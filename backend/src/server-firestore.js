require('dotenv').config();
const express = require('express');
const cors = require('cors');
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
    mensagem: 'API EventHub funcionando com Firestore!',
    versao: '1.0.0',
    database: 'Firestore'
  });
});

// Rotas da API (com Firestore)
const routes = require('./routes-firestore');
app.use('/api', routes);

// Tratamento de erro genérico
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);
  res.status(500).json({ 
    erro: 'Erro interno do servidor',
    detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Configuração da porta
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`✓ Servidor rodando em http://${HOST}:${PORT}`);
  console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Database: Firestore`);
  console.log(`✓ Projeto Google Cloud: ${process.env.GOOGLE_CLOUD_PROJECT || 'não configurado'}`);
});
