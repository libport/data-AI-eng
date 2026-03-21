const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');

async function startServer() {
  try {
    await sequelize.authenticate();
    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
      console.log(`Swagger docs at http://localhost:${env.port}/docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
