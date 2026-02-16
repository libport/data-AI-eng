const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Photo Caption Contest API',
      version: '1.0.0',
      description: 'API for a simple photo caption contest platform'
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' }
          }
        },
        Photo: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            image_path: { type: 'string' },
            image_url: { type: 'string' },
            source: { type: 'string' },
            caption_count: { type: 'integer' }
          }
        },
        Caption: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            comment: { type: 'string' },
            photo_id: { type: 'integer' },
            user_id: { type: 'integer' }
          }
        }
      }
    }
  },
  apis: ['./src/docs/swagger-routes.js']
};

module.exports = swaggerJsDoc(options);
