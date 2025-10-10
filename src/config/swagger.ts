import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Alocação Dinâmica de Turmas',
      version: '1.0.0',
      description: 'Sistema para gerenciamento dinâmico de alocação de salas em uma faculdade',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? 'https://api.exemplo.com/api' : 'http://localhost:3000/api',
        description: process.env.NODE_ENV === 'production' ? 'Servidor de Produção' : 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
