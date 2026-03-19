// Função para mostrar/esconder senha
function toggleSenha(inputId) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
}

// Função para validar email
function validarEmail() {
  const email = document.getElementById('email').value.trim();
  const erroDiv = document.getElementById('email-erro');
  
  if (email.length === 0) {
    erroDiv.style.display = 'none';
    erroDiv.textContent = '';
    return;
  }
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    erroDiv.textContent = 'Email inválido';
    erroDiv.style.display = 'block';
    return;
  }
  
  erroDiv.textContent = '';
  
  // CORREÇÃO 1: Adicionado /api/verificar-email (ou a rota que você usa no backend)
  fetch(`${API_URL}/verificar-email?email=${encodeURIComponent(email)}`)
    .then(res => res.json())
    .then(data => {
      if (data.existe) {
        erroDiv.textContent = 'Email já cadastrado';
        erroDiv.style.display = 'block';
      } else {
        erroDiv.style.display = 'none';
        erroDiv.textContent = '';
      }
    })
    .catch(err => {
      console.error('Erro ao verificar email:', err);
      // erroDiv.textContent = 'Erro ao validar'; // Opcional
    });
}

// Função para atualizar cidades quando estado muda
function atualizarCidades() {
  const estado = document.getElementById('estado').value;
  const cidadeSelect = document.getElementById('cidade');
  
  if (!estado) {
    cidadeSelect.innerHTML = '<option value="">Selecione primeiro um estado</option>';
    cidadeSelect.disabled = true;
    return;
  }
  
  const cidades = obterCidades(estado);
  cidadeSelect.innerHTML = '<option value="">Selecione uma cidade</option>';
  
  cidades.forEach(cidade => {
    const option = document.createElement('option');
    option.value = cidade;
    option.textContent = cidade;
    cidadeSelect.appendChild(option);
  });
  
  cidadeSelect.disabled = false;
}

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
  const estadoSelect = document.getElementById('estado');
  if (estadoSelect) {
    const estados = obterEstados();
    estados.forEach(estado => {
      const option = document.createElement('option');
      option.value = estado.sigla;
      option.textContent = estado.nome;
      estadoSelect.appendChild(option);
    });
  }
  
  const containerPreferencias = document.getElementById('preferencias-categorias');
  if (containerPreferencias) {
    const categoriasDiv = document.createElement('div');
    categoriasDiv.style.cssText = 'display: grid; grid-template-columns: 1fr; gap: 16px;';
    
    const subcategoriaLabel = document.createElement('label');
    subcategoriaLabel.textContent = 'Subcategoria(s) (selecione quantas quiser):';
    subcategoriaLabel.style.cssText = 'display: block; margin-bottom: 8px; color: #aaa; font-size: 12px;';
    
    const subcategoriaContainer = document.createElement('div');
    subcategoriaContainer.id = 'preferencia-subcategorias';
    subcategoriaContainer.style.cssText = 'display: flex; flex-direction: column; gap: 16px; margin-top: 8px; align-items: flex-start;';
    
    obterCategoriasPrincipais().forEach(cat => {
      const headerCategoria = document.createElement('div');
      headerCategoria.style.cssText = 'font-weight: 600; color: var(--text-primary, #00bfff); margin-top: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;';
      headerCategoria.textContent = cat;
      subcategoriaContainer.appendChild(headerCategoria);
      
      const subcategorias = obterSubcategorias(cat);
      subcategorias.forEach(sub => {
        const div2 = document.createElement('div');
        div2.style.cssText = 'display: grid; grid-template-columns: auto 1fr; gap: 8px; align-items: start; margin-left: 12px;';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'preferencia-subcategoria';
        checkbox.value = sub;
        checkbox.id = `pref-${sub.replace(/\s+/g, '-')}`;
        
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = sub;
        label.style.cssText = 'cursor: pointer; margin: 0; font-size: 13px; line-height: 1.2;';
        
        div2.appendChild(checkbox);
        div2.appendChild(label);
        subcategoriaContainer.appendChild(div2);
      });
    });
    
    categoriasDiv.appendChild(subcategoriaLabel);
    categoriasDiv.appendChild(subcategoriaContainer);
    containerPreferencias.appendChild(categoriasDiv);
  }
});

// Cadastro de usuário
const form = document.getElementById('cadastro-form');
const mensagem = document.getElementById('mensagem-cadastro');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    
    const erroDiv = document.getElementById('email-erro');
    if (erroDiv && erroDiv.style.display !== 'none' && erroDiv.textContent) {
      mensagem.textContent = 'Email inválido, tente novamente';
      return;
    }
    
    if (senha !== confirmarSenha) {
      mensagem.textContent = 'As senhas não coincidem.';
      return;
    }
    
    const dados = {
      nome: document.querySelector('input[name="nome"]').value,
      email: email,
      senha: senha,
      estado: document.getElementById('estado').value,
      cidade: document.getElementById('cidade').value
    };
    
    const checkboxesSelecionados = document.querySelectorAll('input[name="preferencia-subcategoria"]:checked');
    dados.preferencias = Array.from(checkboxesSelecionados).map(cb => cb.value);
    
    try {
      // CORREÇÃO 2: Adicionado /usuarios e usando a variável API_URL do global.js
      const resposta = await fetch(`${API_URL}/usuarios`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      
      const textoResposta = await resposta.text(); // Pegamos como texto primeiro para evitar erro de JSON
      let resultado;
      try {
          resultado = JSON.parse(textoResposta);
      } catch(e) {
          throw new Error("Resposta do servidor não é um JSON válido");
      }

      if (resposta.ok) {
        mensagem.textContent = 'Cadastro realizado com sucesso!';
        mensagem.style.color = '#00ff00';
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      } else {
        mensagem.textContent = resultado.erro || 'Erro ao cadastrar.';
        mensagem.style.color = '#ff4444';
      }
    } catch (err) {
      console.error('Erro:', err);
      mensagem.textContent = 'Erro ao conectar com o servidor. Tente novamente.';
      mensagem.style.color = '#ff4444';
    }
  });
}