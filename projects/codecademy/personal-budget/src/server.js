const dotenv = require('dotenv');

dotenv.config();

const { createBudgetStore } = require('./store/budgetStore');
const { createApp } = require('./app');

async function main() {
  const PORT = Number(process.env.PORT) || 5000;
  const databaseUrl = process.env.DATABASE_URL || null;
  const store = createBudgetStore({ databaseUrl });
  await store.init();

  const app = createApp(store);

  const server = app.listen(PORT, () => {
    console.log(`Personal Budget API running on port ${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  });

  const shutdown = () => {
    server.close(async () => {
      try {
        if (typeof store.close === 'function') {
          await store.close();
        }
      } finally {
        process.exit(0);
      }
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
