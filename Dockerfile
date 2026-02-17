FROM node:22-alpine

# Instalar dependências necessárias para o Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npx prisma generate

EXPOSE 3333

CMD ["npm", "start"]
