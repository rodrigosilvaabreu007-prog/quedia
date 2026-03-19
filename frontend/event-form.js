// Função para atualizar cidades quando estado muda (EVENTO)
function atualizarCidadesEvento() {
  const estado = document.getElementById('evento-estado').value;
  const cidadeSelect = document.getElementById('evento-cidade');
  
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

// Preencher dropdowns ao carregar
document.addEventListener('DOMContentLoaded', () => {
  // Preencher estados
  const estadoSelect = document.getElementById('evento-estado');
  if (estadoSelect) {
    const estados = obterEstados();
    estados.forEach(estado => {
      const option = document.createElement('option');
      option.value = estado.sigla;
      option.textContent = estado.nome;
      estadoSelect.appendChild(option);
    });
  }
  
  // Criar seletor de categoria/subcategoria dinâmico
  const categoriasContainer = document.getElementById('categorias-evento');
  if (categoriasContainer) {
    // Criar container
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: grid; grid-template-columns: 1fr; gap: 16px; margin-top: 12px;';
    
    // Label para subcategorias
    const subcategoriaLabel = document.createElement('label');
    subcategoriaLabel.textContent = 'Subcategoria(s) (selecione quantas quiser):';
    subcategoriaLabel.style.cssText = 'display: block; margin-bottom: 8px; color: #aaa; font-size: 12px;';
    
    // Container de subcategorias
    const colDireita = document.createElement('div');
    colDireita.id = 'subcategorias-evento';
    colDireita.style.cssText = 'display: flex; flex-direction: column; gap: 16px; margin-top: 8px; align-items: flex-start;';
    
    // Criar checkboxes para todas as subcategorias, agrupadas por categoria
    obterCategoriasPrincipais().forEach(cat => {
      // Header da categoria
      const headerCategoria = document.createElement('div');
      headerCategoria.style.cssText = 'font-weight: 600; color: var(--text-primary, #00bfff); margin-top: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;';
      headerCategoria.textContent = cat;
      colDireita.appendChild(headerCategoria);
      
      const subcategorias = obterSubcategorias(cat);
      subcategorias.forEach(subcategoria => {
        const div2 = document.createElement('div');
        div2.style.cssText = 'display: grid; grid-template-columns: auto 1fr; gap: 8px; align-items: start; margin-left: 12px;';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'evento-subcategoria';
        checkbox.value = subcategoria;
        checkbox.id = `evento-pref-${subcategoria.replace(/\s+/g, '-')}`;
        checkbox.style.cursor = 'pointer';
        checkbox.style.marginTop = '3px';
        
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = subcategoria;
        label.style.cssText = 'cursor: pointer; margin: 0; font-size: 13px; line-height: 1.2;';
        
        div2.appendChild(checkbox);
        div2.appendChild(label);
        colDireita.appendChild(div2);
      });
    });
    
    wrapper.appendChild(subcategoriaLabel);
    wrapper.appendChild(colDireita);
    categoriasContainer.appendChild(wrapper);
  }
});

// Função para alternar visibilidade do campo de preço
function togglePreco() {
  const gratuito = document.getElementById('gratuito-sim').checked;
  const labelPreco = document.getElementById('label-preco');
  const inputPreco = document.getElementById('preco');
  
  if (gratuito) {
    labelPreco.style.display = 'none';
    inputPreco.required = false;
    inputPreco.value = '';
  } else {
    labelPreco.style.display = 'block';
    inputPreco.required = true;
  }
}

// Função para mostrar preview das imagens selecionadas
function mostrarPreviewImagens() {
  const input = document.getElementById('imagens');
  const preview = document.getElementById('preview-imagens');
  preview.innerHTML = '';
  
  if (input.files.length === 0) return;
  
  Array.from(input.files).forEach((file, index) => {
    if (!file.type.startsWith('image/')) {
      alert(`Arquivo "${file.name}" não é uma imagem válida`);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(`Arquivo "${file.name}" ultrapassa 5MB`);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement('div');
      div.style.cssText = 'margin-bottom: 16px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;';
      div.innerHTML = `
        <img src="${e.target.result}" style="width: 100%; max-width: 200px; border-radius: 8px; margin-bottom: 8px;">
        <p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">${file.name} (${(file.size / 1024).toFixed(2)}KB)</p>
      `;
      preview.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

// Lógica de cadastro de evento
const form = document.getElementById('cadastro-evento');
const mensagem = document.getElementById('mensagem-evento');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('eventhub-token');
  const usuario = JSON.parse(localStorage.getItem('eventhub-usuario'));
  if (!token || !usuario) {
    window.location.href = 'login.html';
    return;
  }
  
  // Validar imagens
  const imagemUrl = document.getElementById('imagem-url').value.trim();
  const imagemInput = document.getElementById('imagens');
  const temImagemUrl = imagemUrl.length > 0;
  const temImagemUpload = imagemInput.files.length > 0;
  
  if (!temImagemUrl && !temImagemUpload) {
    mensagem.textContent = 'Adicione pelo menos uma imagem (URL ou upload)';
    return;
  }
  
  const dados = Object.fromEntries(new FormData(form));
  dados.gratuito = document.getElementById('gratuito-sim').checked;
  if (dados.gratuito) dados.preco = 0;
  dados.organizador_id = usuario.id;
  dados.imagem = imagemUrl || dados.imagem_url;
  delete dados.imagem_url;
  
  // Coletar subcategorias selecionadas
  const subcategorias = Array.from(document.querySelectorAll('input[name="evento-subcategoria"]:checked')).map(cb => cb.value);
  if (subcategorias.length === 0) {
    mensagem.textContent = 'Selecione pelo menos uma subcategoria';
    return;
  }
  dados.subcategorias = subcategorias;
  dados.categoria = document.getElementById('categoria-principal').value;

  try {
    const resposta = await fetch(API_URL + '/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    const resultado = await resposta.json();
    if (resposta.ok) {
      mensagem.textContent = 'Evento cadastrado com sucesso!';
      setTimeout(() => window.location.href = 'index.html', 1500);
      form.reset();
    } else {
      mensagem.textContent = resultado.erro || 'Erro ao cadastrar evento.';
    }
  } catch (err) {
    console.error('Erro:', err);
    mensagem.textContent = 'Erro ao conectar com o servidor. Tente novamente.';
  }
});

