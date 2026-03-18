// Categorias e Subcategorias do EventHub
const categoriasCompletas = {
  'Negócio & Conexão': {
    id: 'negocio',
    subcategorias: ['Seminário', 'Fórum', 'Congresso', 'Conferência', 'Workshop', 'Palestra', 'Meetup profissional', 'Networking', 'Rodada de negócios', 'Feira empresarial', 'Expo empresarial', 'Lançamento de produto', 'Apresentação de startup', 'Pitch de investidores', 'Treinamento corporativo', 'Convenção empresarial', 'Encontro de empreendedores', 'Encontro de startups', 'Painel de discussão', 'Masterclass', 'Curso profissional', 'Bootcamp', 'Hackathon', 'Summit empresarial', 'Feira de inovação']
  },
  'Esporte & Saúde': {
    id: 'esporte',
    subcategorias: ['Corrida de rua', 'Maratona', 'Meia maratona', 'Caminhada', 'Ciclismo', 'Triatlo', 'Natação', 'Campeonato de futebol', 'Campeonato de futsal', 'Campeonato de vôlei', 'Campeonato de basquete', 'Campeonato de handebol', 'Torneio esportivo', 'Torneio de tênis', 'Torneio de beach tennis', 'Torneio de skate', 'Torneio de surf', 'Campeonato de e-sports', 'Evento fitness', 'Aula coletiva', 'Yoga', 'Crossfit', 'Funcional', 'Campeonato de artes marciais', 'Campeonato de jiu-jitsu', 'Campeonato de karatê', 'Campeonato de MMA', 'Campeonato escolar', 'Campeonato universitário']
  },
  'Política & Cidadania': {
    id: 'politica',
    subcategorias: ['Convenção política', 'Debate político', 'Reunião pública', 'Audiência pública', 'Assembleia', 'Conferência municipal', 'Conferência estadual', 'Conferência nacional', 'Encontro comunitário', 'Reunião de bairro', 'Sessão legislativa', 'Encontro partidário', 'Fórum de cidadania', 'Mobilização social', 'Protesto', 'Manifestação', 'Campanha eleitoral', 'Evento governamental', 'Consulta pública']
  },
  'Shows & Festas': {
    id: 'shows',
    subcategorias: ['Show musical', 'Festival de música', 'Festival cultural', 'Balada', 'Festa temática', 'Festa universitária', 'Festival eletrônico', 'Festival de rock', 'Festival sertanejo', 'Festival pop', 'Festival de rap', 'Festival de reggae', 'Festival gospel', 'Festival multicultural', 'DJ set', 'Evento em casa noturna', 'Festa open bar', 'Festa ao ar livre', 'Festa de réveillon', 'Festa de carnaval', 'Festa junina', 'Festival de dança', 'Festival de arte']
  },
  'Social & Comunidade': {
    id: 'social',
    subcategorias: ['Feira comunitária', 'Feira de artesanato', 'Feira de rua', 'Feira gastronômica', 'Feira cultural', 'Feira de livros', 'Evento beneficente', 'Campanha solidária', 'Doação de sangue', 'Mutirão comunitário', 'Evento religioso', 'Encontro religioso', 'Culto especial', 'Retiro espiritual', 'Casamento', 'Aniversário público', 'Inauguração', 'Comemoração municipal', 'Evento de bairro', 'Evento escolar', 'Evento universitário', 'Festa de confraternização', 'Festival comunitário']
  },
  'Cultura & Educação': {
    id: 'cultura',
    subcategorias: ['Exposição de arte', 'Museu', 'Mostra cultural', 'Feira literária', 'Lançamento de livro', 'Clube do livro', 'Sarau', 'Teatro', 'Espetáculo teatral', 'Cinema ao ar livre', 'Festival de cinema', 'Mostra de cinema', 'Workshop artístico', 'Aula aberta', 'Curso', 'Palestra educacional', 'Encontro acadêmico', 'Congresso científico', 'Feira de ciência', 'Olimpíada escolar']
  },
  'Tecnologia & Inovação': {
    id: 'tecnologia',
    subcategorias: ['Hackathon', 'Conferência de tecnologia', 'Meetup de tecnologia', 'Workshop de programação', 'Evento de IA', 'Evento de blockchain', 'Evento de startups', 'Feira de tecnologia', 'Expo tecnologia', 'Summit de inovação', 'Bootcamp de programação', 'Lançamento de software', 'Apresentação de produto tech']
  },
  'Gastronomia': {
    id: 'gastronomia',
    subcategorias: ['Festival gastronômico', 'Festival de food truck', 'Festival de cerveja', 'Festival de vinho', 'Festival de churrasco', 'Festival de café', 'Festival de doces', 'Degustação', 'Aula de culinária', 'Workshop gastronômico', 'Feira gastronômica', 'Competição culinária']
  }
};

// Função para obter categorias principais
function obterCategoriasPrincipais() {
  return Object.keys(categoriasCompletas).sort();
}

// Função para obter subcategorias de uma categoria
function obterSubcategorias(categoria) {
  if (categoriasCompletas[categoria]) {
    return categoriasCompletas[categoria].subcategorias.sort();
  }
  return [];
}

// Função para obter categorias selecionadas
function obterCategoriasSelecioandas(id = 'categoria') {
  const checkboxes = document.querySelectorAll(`input[name="${id}-subcategoria"]:checked`);
  return Array.from(checkboxes).map(cb => cb.value);
}

