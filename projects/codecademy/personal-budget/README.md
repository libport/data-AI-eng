# Personal Budget

Personal Budget is the porfolio project for the *Back-End Development* and *Advanced Back-End Development* modules of Codecademy's Back-End Engineer Professional Certification.

This project extends the envelope budgeting API by adding a PostgreSQL persistence layer, transaction logging, and API documentation with Swagger.

## Objectives covered
- Build Swagger docs for the API.
- Persist data using PostgreSQL.
- Connect envelope endpoints to the database.
- Store transactions for deposits, withdrawals, and transfers.

## Tech stack
- Node.js + Express
- PostgreSQL (`pg`)
- Swagger (`swagger-jsdoc`, `swagger-ui-express`)

## Setup
1. Install dependencies:
```bash
npm install
```
2. Copy env file and update DB credentials:
```bash
cp .env.example .env
```
3. Ensure PostgreSQL is running and database exists:
```sql
CREATE DATABASE personal_budget;
```
4. Start the server:
```bash
npm start
```

Default URLs:
- API: `http://localhost:5000`
- Swagger UI: `http://localhost:5000/api-docs`

## Environment variables
- `PORT`: API port (default `5000`)
- `DATABASE_URL`: Postgres connection string
- `NODE_ENV`: `development` or `production`

Example:
```env
PORT=5000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/personal_budget
NODE_ENV=development
```

## Data model
### `envelopes`
- `id` (serial primary key)
- `name` (varchar 50)
- `balance_cents` (integer, non-negative)
- `created_at`
- `updated_at`

### `transactions`
- `id` (serial primary key)
- `envelope_id` (foreign key -> envelopes.id)
- `type` (`deposit`, `withdraw`, `transfer_in`, `transfer_out`)
- `amount_cents` (integer, positive)
- `balance_after_cents` (integer, non-negative)
- `note` (text)
- `created_at`

## API endpoints
### Envelopes
- `GET /api/v1/envelopes`
- `POST /api/v1/envelopes`
- `GET /api/v1/envelopes/:id`
- `PUT /api/v1/envelopes/:id`
- `PATCH /api/v1/envelopes/:id`
- `DELETE /api/v1/envelopes/:id`

### Envelope transactions
- `GET /api/v1/envelopes/:id/transactions`
- `POST /api/v1/envelopes/:id/transactions`

`POST /api/v1/envelopes/:id/transactions` body example:
```json
{ "type": "withdraw", "amount": 25.5 }
```

### Transfers
- `POST /api/v1/transfers`

Body example:
```json
{ "fromId": 2, "toId": 1, "amount": 50 }
```

## Notes
- Money is stored as integer cents to avoid floating-point issues.
- Transfer and transaction operations are wrapped in SQL transactions for consistency.
- On first run, the app seeds a few starter envelopes if the table is empty.

## Deployment (Render)
For Render, set:
- `NODE_ENV=production`
- `DATABASE_URL` to your hosted PostgreSQL connection string

Then deploy as a Web Service with start command:
```bash
npm start
```