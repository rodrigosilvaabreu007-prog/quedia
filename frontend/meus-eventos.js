// Página de gerenciamento dos eventos do usuário
const container = document.getElementById('meus-eventos-cards');

// Usuário fictício para teste (substituir por autenticação real)
const usuarioId = 1;

async function carregarMeusEventos() {
  container.innerHTML = '';
  try {
    const resposta = await fetch(API_URL + `/eventos?organizador_id=${usuarioId}`);
    const eventos = await resposta.json();
    eventos.forEach(evento => {
      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML = `
        <img src="${evento.imagem || 'https://via.placeholder.com/400x200?text=Evento'}" alt="${evento.nome}" class="event-img">
        <div class="event-info">
          <h2>${evento.nome}</h2>
          <p>${evento.descricao}</p>
          <span class="event-date">${evento.data} ${evento.horario}</span>
          <span class="event-city">${evento.cidade}</span>
          <span class="event-price">${evento.gratuito ? 'Gratuito' : 'R$ ' + evento.preco}</span>
          <button class="edit-btn" data-id="${evento.id}">Editar</button>
          <button class="delete-btn" data-id="${evento.id}">Excluir</button>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = '<p>Erro ao carregar seus eventos.</p>';
  }
}

container.addEventListener('click', async e => {
  if (e.target.classList.contains('delete-btn')) {
    const eventoId = e.target.dataset.id;
    if (confirm('Deseja realmente excluir este evento?')) {
      await fetch(API_URL + `/eventos/${eventoId}`, {
        method: 'DELETE'
      });
      carregarMeusEventos();
    }
  }
  if (e.target.classList.contains('edit-btn')) {
    const eventoId = e.target.dataset.id;
    // Redireciona para página de edição (implementar)
    window.location.href = `editar-evento.html?id=${eventoId}`;
  }
});

window.addEventListener('DOMContentLoaded', carregarMeusEventos);

