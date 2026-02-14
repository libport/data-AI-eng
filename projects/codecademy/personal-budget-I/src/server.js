const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(process.cwd(), '.env') });

const { createBudgetStore } = require('./store/budgetStore');
const { createApp } = require('./app');

async function main() {
  const PORT = Number(process.env.PORT) || 5000;
  const dataFile = process.env.DATA_FILE
    ? path.resolve(process.cwd(), process.env.DATA_FILE)
    : path.join(process.cwd(), 'data', 'envelopes.json');

  const store = createBudgetStore(dataFile);
  await store.init();

  const app = createApp(store);

  const server = app.listen(PORT, () => {
    console.log(`Personal Budget API running on port ${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  });

  const shutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
