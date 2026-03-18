// Arquivo global para funcionalidades compartilhadas em todas as páginas

// Base URL da API
const API_BASE = 'https://seu-backend.onrender.com';

// Função para inicializar o ícone de perfil
function inicializarIconePerfil() {
  const token = localStorage.getItem('eventhub-token');
  const usuario = localStorage.getItem('eventhub-usuario');

  if (token && usuario) {
    try {
      const usuarioData = JSON.parse(usuario);
      const fotoPerfil = localStorage.getItem(`foto-perfil-${usuarioData.id}`);
      const iconePerfilImg = document.getElementById('icone-perfil-img');
      const iconePerfil = document.getElementById('icone-perfil');

      if (iconePerfilImg) {
        if (fotoPerfil) {
          iconePerfilImg.src = fotoPerfil;
          iconePerfilImg.style.display = 'block';
          iconePerfil?.classList.add('has-image');
        } else {
          // Se não tem foto, deixa vazio (o CSS cuidará do ícone padrão)
          iconePerfilImg.src = '';
          iconePerfilImg.style.display = 'none';
          iconePerfil?.classList.remove('has-image');
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar ícone de perfil:', error);
    }
  }
}

// Função para ir para perfil
function irParaPerfil() {
  const token = localStorage.getItem('eventhub-token');
  if (!token) {
    // Se não estiver logado, redireciona para login
    window.location.href = 'login.html';
  } else {
    // Se estiver logado, vai para perfil
    window.location.href = 'perfil.html';
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializarIconePerfil);