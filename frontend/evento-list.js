// Dados globais
let todosEventos = [];
let usuarioAtual = null;

// Função para obter usuário logado
function obterUsuarioLogado() {
  const token = localStorage.getItem('token');
  const usuario = localStorage.getItem('usuario');
  
  if (token && usuario) {
    try {
      return JSON.parse(usuario);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Função para formatar data
function formatarData(data) {
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
}

// Função para criar card de evento
function criarCardEvento(evento) {
  const div = document.createElement('div');
  div.className = 'event-card';
  div.style.cssText = `
    background: var(--bg-secondary, #1a2332);
    border: 1px solid var(--cor-principal, #00bfff);
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
  `;
  
  const preco = evento.preco ? ` - R$ ${evento.preco}` : ' - GRATUITO';
  
  div.innerHTML = `
    <h3 style="margin-top: 0; color: var(--text-primary, #00bfff);">${evento.titulo}</h3>
    <p style="margin: 8px 0; font-size: 14px; color: #aaa;">
      <strong>Local:</strong> ${evento.cidade}, ${evento.estado}
    </p>
    <p style="margin: 8px 0; font-size: 14px; color: #aaa;">
      <strong>Data:</strong> ${formatarData(evento.data)}
    </p>
    <p style="margin: 8px 0; font-size: 14px; color: var(--text-primary, #00bfff);">
      <strong>Categoria:</strong> ${evento.categoria}
    </p>
    <p style="margin: 8px 0; font-size: 14px; color: #aaa;">
      ${evento.descricao.substring(0, 60)}...
    </p>
    <p style="margin: 12px 0 0 0; font-weight: 600; color: var(--text-primary, #00bfff);">${preco}</p>
  `;
  
  div.addEventListener('mouseover', () => {
    div.style.transform = 'translateY(-4px)';
    div.style.boxShadow = `0 8px 16px rgba(0, 191, 255, 0.3)`;
  });
  
  div.addEventListener('mouseout', () => {
    div.style.transform = 'translateY(0)';
    div.style.boxShadow = 'none';
  });
  
  div.addEventListener('click', () => {
    alert(`Evento: ${evento.titulo}\n\n${evento.descricao}`);
  });
  
  return div;
}

// Função para carregar eventos
async function carregarEventos() {
  try {
    const res = await fetch(`${API_BASE}/api/eventos`);
    const dados = await res.json();
    todosEventos = Array.isArray(dados) ? dados : [];
    
    usuarioAtual = obterUsuarioLogado();
    
    atualizarVisualizacaoEventos();
    preencherFiltros();
  } catch (err) {
    console.error('Erro ao carregar eventos:', err);
    document.getElementById('mensagem-eventos').textContent = 'Erro ao carregar eventos';
  }
}

// Função para preencher filtros
function preencherFiltros() {
  // Preencher estado
  const selectEstado = document.getElementById('filtro-estado');
  const estados = obterEstados();
  estados.forEach(estado => {
    const option = document.createElement('option');
    option.value = estado.sigla;
    option.textContent = estado.nome;
    selectEstado.appendChild(option);
  });
  
  // Preencher categorias
  const selectCategoria = document.getElementById('filtro-categoria');
  const categoriasList = ['Show musical', 'Maratona', 'Seminário', 'Conferência', 'Campeonato de futebol', 'Festival', 'Aula', 'Exposição', 'Workshop'];
  categoriasList.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    selectCategoria.appendChild(option);
  });
  
  // Atualizar cidades quando estado muda
  document.getElementById('filtro-estado').addEventListener('change', atualizarCidadesFiltro);
}

// Atualizar cidades do filtro
function atualizarCidadesFiltro() {
  const estado = document.getElementById('filtro-estado').value;
  const selectCidade = document.getElementById('filtro-cidade');
  
  selectCidade.innerHTML = '<option value="">Todas as cidades</option>';
  
  if (estado) {
    const cidades = obterCidades(estado);
    cidades.forEach(cidade => {
      const option = document.createElement('option');
      option.value = cidade;
      option.textContent = cidade;
      selectCidade.appendChild(option);
    });
  }
}

// Função para filtrar eventos
function obterEventosFiltrados() {
  let filtrados = todosEventos;
  
  // Filtro de busca
  const busca = document.getElementById('search-input').value.toLowerCase();
  if (busca) {
    filtrados = filtrados.filter(e => 
      e.titulo.toLowerCase().includes(busca) ||
      e.descricao.toLowerCase().includes(busca) ||
      e.cidade.toLowerCase().includes(busca) ||
      e.categoria.toLowerCase().includes(busca)
    );
  }
  
  // Filtro de estado
  const estado = document.getElementById('filtro-estado').value;
  if (estado) {
    filtrados = filtrados.filter(e => e.estado === estado);
  }
  
  // Filtro de cidade
  const cidade = document.getElementById('filtro-cidade').value;
  if (cidade) {
    filtrados = filtrados.filter(e => e.cidade === cidade);
  }
  
  // Filtro de categoria
  const categoria = document.getElementById('filtro-categoria').value;
  if (categoria) {
    filtrados = filtrados.filter(e => e.categoria === categoria);
  }
  
  // Filtro de preço
  const preco = parseFloat(document.getElementById('filtro-preco').value);
  if (!isNaN(preco)) {
    filtrados = filtrados.filter(e => !e.preco || parseFloat(e.preco) <= preco);
  }
  
  // Filtro de data
  const data = document.getElementById('filtro-data').value;
  if (data) {
    filtrados = filtrados.filter(e => new Date(e.data) >= new Date(data));
  }
  
  return filtrados;
}

// Função para obter eventos para o usuário (baseado em preferências)
function obterEventosParaUsuario() {
  if (!usuarioAtual || !usuarioAtual.preferencias || usuarioAtual.preferencias.length === 0) {
    return [];
  }
  
  return todosEventos.filter(evento => 
    usuarioAtual.preferencias.some(pref => 
      evento.categoria && evento.categoria.toLowerCase().includes(pref.toLowerCase())
    )
  ).slice(0, 6); // Mostrar apenas 6 eventos
}

// Atualizar visualização de eventos
function atualizarVisualizacaoEventos() {
  // Seção "Eventos para Você"
  const eventosPara = obterEventosParaUsuario();
  const containerPara = document.getElementById('eventos-para-voce');
  const msgPara = document.getElementById('mensagem-para-voce');
  
  if (usuarioAtual && eventosPara.length > 0) {
    document.getElementById('section-para-voce').style.display = 'block';
    containerPara.innerHTML = '';
    eventosPara.forEach(evento => {
      containerPara.appendChild(criarCardEvento(evento));
    });
    msgPara.textContent = '';
  } else {
    document.getElementById('section-para-voce').style.display = usuarioAtual ? 'block' : 'none';
    containerPara.innerHTML = '';
    if (usuarioAtual) {
      msgPara.textContent = 'Nenhum evento encontrado com suas preferências. Configure suas preferências no perfil!';
    }
  }
  
  // Seção "Todos os eventos"
  const eventosFiltrados = obterEventosFiltrados();
  const container = document.getElementById('event-cards');
  const msg = document.getElementById('mensagem-eventos');
  
  container.innerHTML = '';
  
  if (eventosFiltrados.length > 0) {
    eventosFiltrados.forEach(evento => {
      container.appendChild(criarCardEvento(evento));
    });
    msg.textContent = '';
  } else {
    msg.textContent = 'Nenhum evento encontrado com esses filtros.';
  }
}

// Limpar filtros
function limparFiltros() {
  document.getElementById('search-input').value = '';
  document.getElementById('filtro-estado').value = '';
  document.getElementById('filtro-cidade').value = '';
  document.getElementById('filtro-categoria').value = '';
  document.getElementById('filtro-preco').value = '';
  document.getElementById('filtro-data').value = '';
  
  atualizarVisualizacaoEventos();
}

// Alternar visibilidade dos filtros
function toggleFiltros() {
  const container = document.getElementById('filtros-container');
  const botao = document.getElementById('toggle-filtros');
  
  if (container.style.display === 'none') {
    container.style.display = 'grid';
    botao.textContent = 'Esconder Filtros ▲';
  } else {
    container.style.display = 'none';
    botao.textContent = 'Mostrar Filtros ▼';
  }
}

// Event listeners para filtros
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('search-input').addEventListener('input', atualizarVisualizacaoEventos);
  document.getElementById('filtro-categoria').addEventListener('change', atualizarVisualizacaoEventos);
  document.getElementById('filtro-cidade').addEventListener('change', atualizarVisualizacaoEventos);
  document.getElementById('filtro-preco').addEventListener('input', atualizarVisualizacaoEventos);
  document.getElementById('filtro-data').addEventListener('change', atualizarVisualizacaoEventos);
  
  carregarEventos();
});

