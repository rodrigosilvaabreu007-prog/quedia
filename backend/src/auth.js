const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

let pool;
try {
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'eventhub_db'
  });
  // Teste de conexão
  pool.query('SELECT 1').catch(err => {
    console.error('Aviso: Banco de dados não disponível. Usando modo demo.');
    pool = null;
  });
} catch (err) {
  console.error('Erro ao conectar ao banco: ', err.message);
  pool = null;
}

// Função para registrar usuário
async function registrarUsuario(dados) {
  const { nome, email, senha, telefone, cidade, tipo, nome_organizacao } = dados;
  const senhaCriptografada = await bcrypt.hash(senha, 10);
  const query = {
    text: 'INSERT INTO usuarios (nome, email, senha, telefone, cidade, tipo, nome_organizacao) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    values: [nome, email, senhaCriptografada, telefone, cidade, tipo, nome_organizacao || null]
  };
  const result = await pool.query(query);
  return result.rows[0].id;
}

// Função para autenticar usuário
async function autenticarUsuario(email, senha) {
  const query = {
    text: 'SELECT * FROM usuarios WHERE email = $1',
    values: [email]
  };
  const result = await pool.query(query);
  if (result.rows.length === 0) return null;
  const usuario = result.rows[0];
  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) return null;
  // Gerar token JWT
  const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, process.env.JWT_SECRET, { expiresIn: '2h' });
  return { usuario, token };
}

module.exports = {
  registrarUsuario,
  autenticarUsuario
};
