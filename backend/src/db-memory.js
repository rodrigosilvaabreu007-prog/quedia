// Banco de dados em memória para teste (será resetado ao reiniciar)
const db = {
  usuarios: [
    {
      id: 1,
      nome: 'Usuário Teste',
      email: 'teste@email.com',
      senha: '$2b$10$V15WBF7Qxcg6l2J6K4m5HOWqQ4Y8N7X6P0Z3M9V8C7R6K5J4H3G2F1', // senha: '123456'
      cidade: 'São Paulo',
      tipo: 'organizador',
      criado_em: new Date()
    }
  ],
  eventos: [],
  interesses: []
};

module.exports = db;
