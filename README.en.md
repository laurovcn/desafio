# Brain Agriculture - Technical Challenge v2

Welcome! This is a technical challenge for backend developers. The goal is to build a clean, scalable, and well-documented API for managing rural producers, properties, harvests, and crops.

## Features

- **CRUD for Farmers, Properties, Harvests, and Crops**
- **CPF/CNPJ validation** for farmers
- **Business rules**: sum of arable and vegetation areas cannot exceed total area
- **Multiple crops per property and harvest**
- **Dashboard** with:
  - Total farms
  - Total hectares
  - Pie charts by state, crop, and land use
- **Pagination** on all listing endpoints
- **Input validation** with Zod
- **OpenAPI/Swagger documentation** auto-generated from Zod schemas
- **Unit tests** for all main services
- **Centralized business and input validation**
- **Clean, modular, and SOLID architecture**
- **Winston logger for observability**
- **Docker-ready for local development**

## Tech Stack

- **NestJS** (with Fastify)
- **Prisma ORM** (PostgreSQL)
- **Zod** for validation
- **@asteasolutions/zod-to-openapi** for OpenAPI docs
- **Swagger** at `/api`
- **Jest** for unit tests
- **Docker** for local environment

## How to Run

1. Install dependencies:
   ```sh
   npm install
   ```
2. Configure the database:
   - Copy `.env.example` to `.env` and adjust if needed.
   - Start Postgres with Docker:
     ```sh
     docker-compose up -d
     ```
   - Run migrations and generate Prisma client:
     ```sh
     npx prisma migrate deploy
     npx prisma generate
     ```
   - (Optional) Seed the database:
     ```sh
     npm run prisma:seed
     ```
3. Start the app:
   ```sh
   npm run start:dev
   ```

## API Documentation

- Access: [http://localhost:3000/api](http://localhost:3000/api)
- All input/output contracts are based on Zod and reflected in Swagger.
- Example payloads and responses are available in the docs.

## Testing

Run all unit tests:

```sh
npm run test
```

## Main Endpoints

- **Farmers**: `/farmers`
- **Properties**: `/properties`
- **Harvests**: `/harvests`
- **Crops**: `/crops`
- **Dashboard**: `/dashboard`
- **Healthcheck**: `/health`

## Example Payload (Property Creation)

```json
{
  "name": "Green Valley Farm",
  "city": "Springfield",
  "state": "IL",
  "totalArea": 100,
  "arableArea": 60,
  "vegetationArea": 40,
  "farmerId": "<farmer-uuid>"
}
```

## Business Rules

- 100% input validation with Zod, reflected in docs
- Layered architecture, SOLID, Clean Code
- Unit tests for all business rules
- Ready for production

---

> Project developed for Brain Agriculture technical challenge. Questions or suggestions? Open an issue!
