# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY backend/package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Stage final
FROM node:18-alpine

WORKDIR /app

# Copiar node_modules do builder
COPY --from=builder /app/node_modules ./node_modules

# Copiar aplicação
COPY backend/src ./src
COPY backend/.env* ./

# Criar diretórios necessários
RUN mkdir -p /app/logs

# Expor porta
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando para iniciar (usar Firestore por padrão)
CMD ["node", "src/server-firestore.js"]
