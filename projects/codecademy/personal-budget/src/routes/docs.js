const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

const options = {
  definition: {
    openapi: '3.0.0',
    servers: [{ url: 'http://localhost:5000', description: 'Local dev' }],
    info: {
      title: 'Personal Budget API',
      version: '2.0.0',
      description: 'Envelope budgeting API with PostgreSQL persistence and transaction logging.',
      license: { name: 'MIT' },
    },
  },
  // swagger-jsdoc resolves globs relative to process.cwd()
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJSDoc(options);

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs, { explorer: true }));

module.exports = router;
