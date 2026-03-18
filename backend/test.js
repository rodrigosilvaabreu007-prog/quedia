const http = require('http');
http.get('http://localhost:3001/', res => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('Resposta:', data));
}).on('error', err => console.log('Erro:', err.message));
