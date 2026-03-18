// Sistema de temas avançado
const themeBtn = document.createElement('button');
themeBtn.textContent = '🎨 Tema';
themeBtn.className = 'theme-btn';
document.body.appendChild(themeBtn);

const themeModal = document.createElement('div');
themeModal.className = 'theme-modal';
themeModal.innerHTML = `
  <div class="theme-modal-content">
    <div class="theme-header">
      <h2>🎨 Personalizar Tema</h2>
      <p>Customize as cores da sua experiência</p>
    </div>

    <div class="theme-grid">
      <div class="theme-section">
        <h3>🎯 Cores Principais</h3>
        <div class="color-group">
          <label class="color-label">
            <span>Cor Principal</span>
            <input type="color" id="theme-main" value="#00bfff">
            <div class="color-preview" id="preview-main"></div>
          </label>
          <small>Afeta botões, bordas e elementos visuais</small>
        </div>
      </div>

      <div class="theme-section">
        <h3>🏠 Plano de Fundo</h3>
        <div class="color-group">
          <label class="color-label">
            <span>Cor do Fundo</span>
            <input type="color" id="theme-bg" value="#181a20">
            <div class="color-preview" id="preview-bg"></div>
          </label>
          <small>Cor de fundo da página</small>
        </div>
      </div>

      <div class="theme-section">
        <h3>📝 Texto</h3>
        <div class="color-group">
          <label class="color-label">
            <span>Cor do Texto</span>
            <input type="color" id="theme-text" value="#ffffff">
            <div class="color-preview" id="preview-text"></div>
          </label>
          <small>Cor de todos os textos</small>
        </div>
      </div>
    </div>

    <div class="theme-actions">
      <button id="reset-theme" class="btn-secondary">🔄 Resetar</button>
      <button id="save-theme" class="btn-primary">💾 Salvar</button>
      <button id="close-theme" class="btn-secondary">❌ Fechar</button>
    </div>
  </div>
`;
document.body.appendChild(themeModal);
themeModal.style.display = 'none';

themeBtn.onclick = () => {
  themeModal.style.display = 'flex';
  updatePreviews();
};
document.getElementById('close-theme').onclick = () => themeModal.style.display = 'none';

document.getElementById('save-theme').onclick = () => {
  const corPrincipal = document.getElementById('theme-main').value;
  const corFundo = document.getElementById('theme-bg').value;
  const corTexto = document.getElementById('theme-text').value;

  // Aplicar cores
  document.body.style.setProperty('--cor-principal', corPrincipal);
  document.body.style.setProperty('--bg-primary', corFundo);
  document.body.style.setProperty('--text-primary', corTexto);

  // Salvar preferências
  localStorage.setItem('eventhub-theme', JSON.stringify({ corPrincipal, corFundo, corTexto }));

  themeModal.style.display = 'none';
  showNotification('Tema salvo com sucesso!', 'success');
};

document.getElementById('reset-theme').onclick = () => {
  // Resetar para valores padrão
  document.getElementById('theme-main').value = '#00bfff';
  document.getElementById('theme-bg').value = '#181a20';
  document.getElementById('theme-text').value = '#ffffff';
  updatePreviews();
};

function updatePreviews() {
  document.getElementById('preview-main').style.backgroundColor = document.getElementById('theme-main').value;
  document.getElementById('preview-bg').style.backgroundColor = document.getElementById('theme-bg').value;
  document.getElementById('preview-text').style.backgroundColor = document.getElementById('theme-text').value;
}

// Atualizar previews em tempo real
document.getElementById('theme-main').addEventListener('input', updatePreviews);
document.getElementById('theme-bg').addEventListener('input', updatePreviews);
document.getElementById('theme-text').addEventListener('input', updatePreviews);

// Restaurar tema salvo
const savedTheme = localStorage.getItem('eventhub-theme');
if (savedTheme) {
  const { corPrincipal, corFundo, corTexto } = JSON.parse(savedTheme);
  document.body.style.setProperty('--cor-principal', corPrincipal);
  document.body.style.setProperty('--bg-primary', corFundo);
  document.body.style.setProperty('--text-primary', corTexto);

  // Definir valores nos inputs
  document.getElementById('theme-main').value = corPrincipal;
  document.getElementById('theme-bg').value = corFundo;
  document.getElementById('theme-text').value = corTexto;
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

