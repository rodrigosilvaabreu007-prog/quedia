# EventHub Backend - Guia de Migração para Google Cloud Storage + Firestore + Cloud Run

## 1. Pré-requisitos

- Node.js 18+ instalado
- Conta Google Cloud Platform
- `gcloud` CLI instalado

## 2. Setup no Google Cloud

### 2.1 Criar projeto Google Cloud
```bash
gcloud projects create quedia-eventhub --name="Quedia EventHub"
gcloud config set project quedia-eventhub
```

### 2.2 Habilitar APIs necessárias
```bash
gcloud services enable firestore.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable storage-api.googleapis.com
```

### 2.3 Criar banco Firestore
```bash
gcloud firestore databases create --type=native --location=us-central1
```

### 2.4 Criar Storage Bucket (para imagens)
```bash
gsutil mb gs://quedia-eventhub-images
```

### 2.5 Criar conta de serviço
```bash
gcloud iam service-accounts create eventhub-backend
gcloud projects add-iam-policy-binding quedia-eventhub \
  --member=serviceAccount:eventhub-backend@quedia-eventhub.iam.gserviceaccount.com \
  --role=roles/editor
```

### 2.6 Criar chave JSON
```bash
gcloud iam service-accounts keys create credentials.json \
  --iam-account=eventhub-backend@quedia-eventhub.iam.gserviceaccount.com
```

## 3. Configurar variáveis de ambiente

Criar arquivo `.env`:
```
NODE_ENV=production
PORT=8080
HOST=0.0.0.0

# Google Cloud
GOOGLE_CLOUD_PROJECT=quedia-eventhub
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json

# JWT
JWT_SECRET=sua_chave_secreta_bem_longa_aqui

# CORS
CORS_ORIGIN=https://seu-dominio.com,http://localhost:3000
```

## 4. Instalar dependências necessárias
```bash
npm install firebase-admin
npm install
```

## 5. Deploy para Cloud Run

### 5.1 Criar Dockerfile (já deve existir)
```bash
gcloud run deploy eventhub-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_CLOUD_PROJECT=quedia-eventhub
```

### 5.2 Atualizar URLs do frontend

No `frontend/global.js`, atualizar:
```javascript
const API_URL = 'https://eventhub-api-xxxxx.run.app/api';
```

## 6. Estrutura Firestore

Collections:
- `/usuarios` - Dados dos usuários
- `/eventos` - Catálogo de eventos
- `/interesses` - Relacionamento usuário-evento

## 7. Monitoramento

```bash
gcloud run logs read eventhub-api --region us-central1 --limit 50
```

## Troubleshooting

### Erro de permissão:
Certifique-se que a conta de serviço tem permissões de Firestore e Storage.

### Conexão com Firestore falha:
Verifique se `credentials.json` está presente e a variável de ambiente está configurada.

### Cloud Run timeout:
Aumente o timeout na configuração da Cloud Run (defaut 300s).
