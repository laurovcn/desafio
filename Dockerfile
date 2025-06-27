# Multi-stage build para produção
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Imagem final de produção
FROM node:18-alpine AS production

WORKDIR /app

# Instalar dumb-init para gerenciamento de processos
RUN apk add --no-cache dumb-init

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copiar dependências de produção
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Definir usuário
USER nestjs

# Expor porta
EXPOSE 3000

# Comando de entrada
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]
