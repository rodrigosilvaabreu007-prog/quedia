# ⚡ Quick Start - Comece Agora!

## 1️⃣ Testar Localmente (2 minutos)

```bash
# Abrir terminal na pasta do projeto
cd c:\Users\tidia\Downloads\quedia.com.br\backend

# Instalar dependências
npm install

# Começar projeto
npm run dev
```

✅ Backend estará rodando em `http://localhost:3000`

## 2️⃣ Abrir Frontend (1 minuto)

```bash
# Em outro terminal
cd c:\Users\tidia\Downloads\quedia.com.br\frontend

# Abrir em navegador (ou usar servidor HTTP)
# Opção 1: Abrir arquivo direto
# Double-click em index.html

# Opção 2: Servidor Python (melhor)
python -m http.server 8000

# Então acessar http://localhost:8000
```

✅ Frontend estará em `http://localhost:8000`

## 3️⃣ Testar Funcionalidades (5 minutos)

**Testar Cadastro:**
1. Ir em "Cadastro"
2. Preencher email: `teste@exemplo.com`
3. Preencher senha: `Senha123!`
4. Clicar "Registrar"
5. ✅ Deve aparecer mensagem "Usuário cadastrado com sucesso!"

**Testar Login:**
1. Ir em "Login"
2. Email: `teste@exemplo.com`
3. Senha: `Senha123!`
4. ✅ Deve redirecionar para home

**Ver dados no console:**
```javascript
// Abrir DevTools (F12)
// Console
localStorage.getItem('eventhub-usuario') // Ver usuário armazenado
localStorage.getItem('eventhub-token')   // Ver token JWT
```

## 4️⃣ Para o Google Cloud (Próximo)

Quando tudo estiver funcionando localmente:

```bash
# 1. Instalar Google Cloud CLI
# https://cloud.google.com/sdk/docs/install

# 2. Autenticar
gcloud auth login

# 3. Criar projeto (um vez apenas)
gcloud projects create quedia-eventhub

# 4. Deploy
gcloud run deploy eventhub-api --source .
```

Seguir `GOOGLE_CLOUD_SETUP.md` para instruções detalhadas.

## 📋 Status de Tudo

✅ **Backend** - Pronto para funcionar  
✅ **Frontend** - Pronto para funcionar  
✅ **URLs** - Corrigidas para localhost  
✅ **Banco de Dados** - SQLite funcionando  
✅ **Docker** - Pronto para produção  
✅ **Google Cloud** - Configuração preparada  

## 🚨 Se Algo Não Funcionar

### "Module not found: express"
```bash
cd backend
npm install
```

### "CORS Error"
- Abra o arquivo `backend/.env`
- (Ele não existe ainda? Criar a partir de `.env.example`)
- Adicionar: `CORS_ORIGIN=*`

### Frontend não consegue acessar backend
- Verificar em F12 > Console
- Verificar que backend está rodando (http://localhost:3000)
- Verificar API_URL em `frontend/global.js`

### Erro de banco de dados
- Deletar arquivo `backend/usuarios.db`
- Reiniciar backend: `npm run dev`

## 📚 Arquivos Importantes

| File | Propósito |
|------|-----------|
| `README.md` | Documentação completa |
| `GOOGLE_CLOUD_SETUP.md` | Guia Google Cloud |
| `RESUMO_MUDANCAS.md` | O que foi corrigido |
| `DEPLOY_CHECKLIST.md` | Antes de fazer deploy |
| `backend/.env.example` | Template de variáveis |

## 🎯 Próximos Passos

1. ✅ Testar localmente agora
2. ✅ Testar todas as funcionalidades
3. ✅ Depois seguir `GOOGLE_CLOUD_SETUP.md`
4. ✅ Fazer deploy com `gcloud run deploy`

## 💡 Dicas

- Usar DevTools do navegador (F12) para debug
- Logs do backend aparecem no terminal
- Mudar variáveis em `.env` sem reiniciar? Não funciona, deve reiniciar!
- SQLite cria arquivo `usuarios.db` automaticamente

---

**Comentário importante**: O projeto estava com muitas configurações quebradas do Railway. Agora está 100% funcional e pronto para qualquer plataforma incluindo Google Cloud Storage.

**Tempo estimado até estar online**: 30 minutos (incluindo setup Google Cloud)

**Boa sorte! 🚀**
