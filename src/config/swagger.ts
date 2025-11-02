import path from 'path';

const definition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Alocação Dinâmica de Turmas',
    version: '1.0.0',
    description: 'Sistema para gerenciamento dinâmico de alocação de salas em uma faculdade',
  },
  servers: [
    {
      url:
        process.env.NODE_ENV === 'production'
          ? 'https://api.exemplo.com/api'
          : `http://localhost:${process.env.PORT || 3000}/api`,
      description:
        process.env.NODE_ENV === 'production' ? 'Servidor de Produção' : 'Servidor de Desenvolvimento',
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
} as const;

// Resolve API glob patterns depending on environment (dist in production)
const apis =
  process.env.NODE_ENV === 'production'
    ? [path.resolve(process.cwd(), 'dist/routes/*.js')]
    : [path.resolve(process.cwd(), 'src/routes/*.ts')];

export function buildSwaggerSpec() {
  try {
    // Load swagger-jsdoc dynamically to avoid module init failures crashing the process
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swaggerJsdoc = require('swagger-jsdoc');
    const options = { definition, apis };
    return swaggerJsdoc(options);
  } catch (err) {
    // Fallback: return minimal spec without parsed route annotations
    // so the server doesn't crash if glob/minimatch has incompatibilities.
    // eslint-disable-next-line no-console
    console.warn('Swagger initialization failed, serving minimal spec. Error:', err);
    return { ...definition, paths: {} } as any;
  }
}

export const minimalSwaggerSpec = { ...definition, paths: {} } as any;
