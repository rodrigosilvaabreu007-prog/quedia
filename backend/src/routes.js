const express = require('express');
const router = express.Router();
const { registrarUsuario, autenticarUsuario } = require('./auth');

const { cadastrarEvento, listarEventos } = require('./eventos');
const nodemailer = require('nodemailer');

const { marcarInteresse, contarInteressados } = require('./interesse');

// Rota de cadastro
router.post('/cadastro', async (req, res) => {
  try {
    const id = await registrarUsuario(req.body);
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', id });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao cadastrar usuário', detalhes: err.message });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const resultado = await autenticarUsuario(email, senha);
    if (!resultado) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }
    res.json({ usuario: resultado.usuario, token: resultado.token });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao autenticar', detalhes: err.message });
  }
});

// Rota para cadastrar evento
router.post('/eventos', async (req, res) => {
  try {
    const id = await cadastrarEvento(req.body);
    res.status(201).json({ mensagem: 'Evento cadastrado com sucesso!', id });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao cadastrar evento', detalhes: err.message });
  }
});

// Rota para listar eventos
// Rota para listar eventos com filtros
router.get('/eventos', async (req, res) => {
  try {
    const eventos = await listarEventos(req.query);
    res.json(eventos);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao listar eventos', detalhes: err.message });
  }
});

// Marcar interesse em evento
router.post('/eventos/:id/interesse', async (req, res) => {
  const evento_id = req.params.id;
  const usuario_id = req.body.usuario_id;
  try {
    await marcarInteresse(usuario_id, evento_id);
    const total = await contarInteressados(evento_id);
    res.json({ sucesso: true, total });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao marcar interesse', detalhes: err.message });
  }
});

// Contador de interessados
router.get('/eventos/:id/interesse', async (req, res) => {
  const evento_id = req.params.id;
  try {
    const total = await contarInteressados(evento_id);
    res.json({ total });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao contar interessados', detalhes: err.message });
  }
});
module.exports = router;

// Rota de contato
router.post('/contato', async (req, res) => {
  const { nome, email, mensagem } = req.body;
  try {
    // Configuração do transporte
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'quedia.com.br@gmail.com',
        pass: process.env.GMAIL_PASS
      }
    });
    await transporter.sendMail({
      from: email,
      to: 'quedia.com.br@gmail.com',
      subject: `Contato EventHub de ${nome}`,
      text: mensagem
    });
    res.json({ mensagem: 'Mensagem enviada com sucesso!' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao enviar mensagem', detalhes: err.message });
  }
});
