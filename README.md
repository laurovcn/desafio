# Desafio Técnico - Backend NodeJS (NestJS, Prisma, Fastify, Zod)

API para gerenciamento de produtores rurais, propriedades, safras e culturas.

## Tecnologias

- **NestJS** + **Fastify**
- **Prisma ORM** (PostgreSQL)
- **Zod** para validação e contratos
- **@asteasolutions/zod-to-openapi** para documentação automática
- **Swagger** (OpenAPI) em `/api`
- **Testes unitários** (Jest)
- **Docker** para ambiente local

## Como rodar o projeto

1. Instale as dependências:
   ```sh
   npm install
   ```
2. Configure o banco de dados:
   - Copie `.env.example` para `.env` e ajuste se necessário.
   - Suba o banco com Docker:
     ```sh
     docker-compose up -d
     ```
   - Rode as migrations e gere o client Prisma:
     ```sh
     npx prisma migrate deploy
     npx prisma generate
     ```
   - (Opcional) Popule o banco com dados de exemplo:
     ```sh
     npm run prisma:seed
     ```
3. Inicie a aplicação:
   ```sh
   npm run start:dev
   ```

## Documentação da API

- Acesse: [http://localhost:3000/api](http://localhost:3000/api)
- Todos os contratos de entrada/saída são baseados em **Zod** e refletem exatamente o que é validado.
- Exemplos de payloads e respostas disponíveis no Swagger.

## Testes

Execute:

```sh
npm run test
```

## Estrutura dos principais endpoints

- **Produtores rurais**: `/farmers`
- **Propriedades**: `/properties`
- **Safras**: `/harvests`
- **Culturas**: `/crops`
- **Dashboard**: `/dashboard`
- **Healthcheck**: `/health`

## Exemplo de payload (criação de propriedade)

```json
{
  "name": "Green Valley Farm",
  "city": "Springfield",
  "state": "IL",
  "totalArea": 100,
  "arableArea": 60,
  "vegetationArea": 40,
  "farmerId": "<uuid-do-produtor>"
}
```

## Observações

- Validação de entrada 100% via Zod, refletida na documentação.
- Arquitetura em camadas, SOLID, Clean Code.
- Testes unitários cobrindo regras de negócio.
- Código pronto para produção.

---

> Projeto desenvolvido para desafio técnico. Dúvidas ou sugestões? Abra uma issue!
