// Login de usuário
const form = document.getElementById('login-form');
const mensagem = document.getElementById('mensagem-login');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const dados = Object.fromEntries(new FormData(form));
  console.log('Tentando login com email:', dados.email);
  
  try {
    const resposta = await fetch(API_URL + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    const resultado = await resposta.json();
    console.log('Resposta do servidor:', resultado);
    
    if (resposta.ok) {
      mensagem.textContent = 'Login realizado com sucesso!';
      mensagem.style.color = '#4CAF50';
      // Salva token e usuário
      localStorage.setItem('eventhub-token', resultado.token);
      localStorage.setItem('eventhub-usuario', JSON.stringify(resultado.usuario));
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      mensagem.textContent = resultado.erro || 'Erro ao fazer login.';
      mensagem.style.color = '#ff6b6b';
      console.error('Erro de login:', resultado.erro);
    }
  } catch (err) {
    mensagem.textContent = 'Erro de conexão com o servidor.';
    mensagem.style.color = '#ff6b6b';
    console.error('Erro de conexão:', err);
  }
});

