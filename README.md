<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

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
