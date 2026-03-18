require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// Rota de teste
app.get('/', (req, res) => {
  res.send('API EventHub funcionando!');
});

// Rotas (usando SQLite para persistência)
const routes = require('./routes-sql');
app.use('/api', routes);

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Servidor rodando na porta ${PORT}`);
  console.log(`✓ Acesse: http://localhost:${PORT}`);
});
