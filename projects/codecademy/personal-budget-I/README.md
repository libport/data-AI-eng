# Portfolio Project: Personal Budget I
Personal Budget is the porfolio project for the *Back-End Development* module of Codecademy's Back-End Engineer Professional Certification.

## Instructions
For this project, you will build an API that allows clients to create and manage a personal budget. Using Envelope Budgeting principles, your API should allow users to manage budget envelopes and track the balance of each envelope. Your API should follow best practices regarding REST endpoint naming conventions, proper response codes, etc. Make sure to include data validation to ensure users do not overspend their budget!

Project Objectives:
- Build an API using Node.js and Express
- Be able to create, read, update, and delete envelopes
- Create endpoint(s) to update envelope balances
- Use Git version control to keep track of your work
- Use the command line to navigate your files and folders
- Use Postman to test API endpoints

Prerequisites:
- Command line and file navigation
- Javascript
- Node.js
- Express
- Git and GitHub
- Postman

## README
This project is a simple Node.js + Express REST API that lets you manage budget envelopes and prevents overspending.

Code style target:
- beginner-friendly modules
- straightforward controller validation
- file-based storage without advanced patterns

## Run locally
```bash
npm install
# optional: cp .env.example .env
npm run start
```

Default:
- API: `http://localhost:5000`
- Swagger UI: `http://localhost:5000/api-docs`

## Data model
Each envelope stores a balance. Balances are stored as cents with the type integer to avoid floating point errors.

Envelope shape in responses:

```json
{
  "id": 1,
  "name": "Rent",
  "balance": 1000.00,
  "createdAt": "2026-02-14T00:00:00.000Z",
  "updatedAt": "2026-02-14T00:00:00.000Z"
}
```

## Endpoints
### Envelopes
- `GET /api/v1/envelopes` — list all envelopes
- `POST /api/v1/envelopes` — create an envelope
- `GET /api/v1/envelopes/:id` — get an envelope
- `PUT /api/v1/envelopes/:id` — full update (replace)
- `PATCH /api/v1/envelopes/:id` — partial update
- `DELETE /api/v1/envelopes/:id` — delete (204)
### Balance updates
- `POST /api/v1/envelopes/:id/transactions`

Body:

```json
{ "type": "deposit", "amount": 50 }
```

or

```json
{ "type": "withdraw", "amount": 20.25 }
```

If a withdrawal makes the balance negative:
- `409 Conflict` `{ "error": { "message": "Insufficient funds in envelope" ... } }`

### Transfers
- `POST /api/v1/transfers`

Body:

```json
{ "fromId": 2, "toId": 1, "amount": 50 }
```

Also returns `409 Conflict` if the origin envelope lacks funds.

## Postman
A ready-to-import collection is included:
- `postman/PersonalBudget.postman_collection.json`
- `postman/PersonalBudget.postman_environment.json`

Import both into Postman, then set the environment variable:
- `baseUrl` = `http://localhost:5000`

## Folder layout
- `src/server.js` starts the app
- `src/app.js` configures middleware and routes
- `src/routes/` maps endpoints to controllers
- `src/controllers/` handles request logic and validation
- `src/store/budgetStore.js` reads/writes `data/envelopes.json`
