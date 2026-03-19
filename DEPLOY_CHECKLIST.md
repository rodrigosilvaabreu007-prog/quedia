# ✅ Checklist - Antes de Fazer Deploy

Use este checklist para garantir que tudo está pronto antes de fazer deploy no Google Cloud.

## 🔐 Segurança

- [ ] Criar arquivo `backend/.env` baseado em `.env.example`
- [ ] Gerar JWT_SECRET forte (mínimo 32 caracteres)
- [ ] Baixar `credentials.json` do Google Cloud
- [ ] Salvar `credentials.json` em `backend/`
- [ ] Verificar que `.gitignore` inclui `credentials.json`
- [ ] Verificar que `credentials.json` não está em git: `git status`
- [ ] Mudar senha padrão do banco de dados (se aplicável)

## 🗂️ Código

- [ ] Verificar que `frontend/global.js` tem a URL correta (localhost ou produção)
- [ ] Testar backend localmente: `npm run dev` (deve iniciar em 3000)
- [ ] Testar login/cadastro
- [ ] Testar criação de evento
- [ ] Verificar console do navegador (F12) para erros de rede
- [ ] Verificar que não há URLs hardcoded para Railway

## 📦 Dependências

- [ ] Executar `npm install` em `backend/`
- [ ] Executar `npm install` em `frontend/` (se houver)
- [ ] Verificar que `firebase-admin` está instalado
- [ ] Verificar que `bcrypt` está instalado
- [ ] Verificar que `cors` e `dotenv` estão instalados

## 🐳 Docker & Google Cloud

- [ ] Instalar Google Cloud CLI: `gcloud --version`
- [ ] Autenticar: `gcloud auth login`
- [ ] Definir projeto: `gcloud config set project quedia-eventhub`
- [ ] Verificar que `Dockerfile` existe e está correto
- [ ] Testar build local: `docker build -t eventhub-api .`
- [ ] (Opcional) Testar container localmente

## 🌍 Google Cloud Setup

- [ ] Criar projeto Google Cloud (ou usar existente)
- [ ] Habilitar Firestore API
- [ ] Habilitar Cloud Run API
- [ ] Criar banco Firestore
- [ ] Criar Storage Bucket (para imagens)
- [ ] Criar conta de serviço
- [ ] Fazer download da chave JSON
- [ ] Definir permissões corretas

## 🚀 Deploy

### Opção 1: Cloud Run (Recomendado)
- [ ] Executar: `gcloud run deploy eventhub-api --source .`
- [ ] Escolher região: `us-central1` (ou próxima a seus usuários)
- [ ] Permitir acesso não autenticado quando solicitado
- [ ] Copiar URL do serviço (ex: `https://eventhub-api-xxxxx.run.app`)

### Opção 2: Cloud Build (CI/CD)
- [ ] Conectar repositório GitHub
- [ ] Fazer push de `cloudbuild.yaml`
- [ ] Build começará automaticamente

## 🔗 Frontend

- [ ] Atualizar `frontend/global.js` com URL do Cloud Run
- [ ] Deploy frontend para Netlify, Vercel ou seu host
- [ ] Testar que frontend consegue acessar backend

## 🧪 Testes

- [ ] Testar registro de novo usuário
- [ ] Testar login
- [ ] Testar criação de evento
- [ ] Testar listagem de eventos
- [ ] Testar marcar interesse em evento
- [ ] Verificar erros no console cloud: `gcloud run logs read eventhub-api`

## 📊 Monitoramento

- [ ] Configurar alertas no Google Cloud Console
- [ ] Monitorar logs periodicamente
- [ ] Verificar uso de quota de Firestore
- [ ] Configurar backup automático (Firestore faz isso)

## 💰 Custos (Importante!)

- [ ] Ler documentação de preços Google Cloud
- [ ] Firestore: $0.06 por 100k leitures (gratuito até 50mil/dia)
- [ ] Cloud Run: $0.20 por milhão de requests (gratuito até 2 milhões/mês)
- [ ] Storage: $0.020 por GB/mês (primeiros 5GB gratuitos com Firebase)
- [ ] Configurar alerts de orçamento: `gcloud billing budgets create`

## 📝 Documentação

- [ ] Ler `README.md`
- [ ] Ler `GOOGLE_CLOUD_SETUP.md`
- [ ] Ler `RESUMO_MUDANCAS.md`
- [ ] Manter registros de credenciais em local seguro
- [ ] Documentar URL final do backend

## 🔄 Atualizar Após Deploy

- [ ] Informar equipe sobre nova URL da API
- [ ] Atualizar DNS se usar domínio customizado  
- [ ] Configurar CORS para produção:
  ```env
  CORS_ORIGIN=https://seu-dominio.com
  ```
- [ ] Fazer deploy do frontend com URL atualizada
- [ ] Anunciar que o site está de volta ao ar

## ❌ Problemas Comuns

Se enfrentar problemas:

### Backend não inicia
```bash
# Verificar logs locais
npm run dev

# Verificar no Cloud Run
gcloud run logs read eventhub-api --region us-central1 --limit 50
```

### CORS Error no frontend
```
Adicionar seu domínio em CORS_ORIGIN do .env
```

### Firestore não funciona
```bash
# Verificar credenciais
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json

# Testar conexão
npm run start:firestore
```

### Imagens não carregam
```bash
# Configurar Storage Bucket público
gsutil iam ch serviceAccount:eventhub-backend@PROJECT.iam.gserviceaccount.com:roles/storage.objectViewer gs://seu-bucket
```

## 📞 Recursos Úteis

- Google Cloud Console: https://console.cloud.google.com
- Cloud Run Status: https://cloud.google.com/run/status
- Firebase Docs: https://firebase.google.com/docs
- Express.js Docs: https://expressjs.com/
- Cloud Pricing: https://cloud.google.com/pricing/calculator

---

## Muito Importante! 🔴

**ANTES de fazer qualquer deploy:**

1. **Testar localmente** até ter certeza que tudo funciona
2. **Configurar JWT_SECRET forte** - não use "secret"
3. **Proteger credentials.json** - adicionar ao .gitignore
4. **Revisar permisp de segurança** - não deixar tudo público
5. **Configurar CORS corretamente** - apenas seu domínio

---

**Quando tudo estiver funcionando:**
✅ Seu site estará online em Google Cloud  
✅ Escalável automaticamente  
✅ 99.99% uptime garantido  
✅ Suporte profissional disponível  

**Parabéns por ter completado a migração!** 🎉
