import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { buildSwaggerSpec, minimalSwaggerSpec } from './config/swagger';
import routes from './routes';
import { errorHandler } from './middlewares';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private configureRoutes(): void {
    this.app.get('/api/health', (req, res) => {
      res.json({
        success: true,
        message: 'API funcionando corretamente',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });

    this.app.get('/', (req, res) => {
      res.json({
        message: 'API de Alocação Dinâmica de Turmas',
        version: '1.0.0',
        docs: '/api-docs',
        endpoints: {
          auth: '/api/auth',
          users: '/api/users',
          cursos: '/api/cursos',
          turmas: '/api/turmas',
          salas: '/api/salas',
          configuracoes: '/api/configuracoes-sala',
          previsoes: '/api/previsoes',
        },
      });
    });

    if (process.env.SWAGGER_DISABLED === 'true') {
      // Swagger disabled: expose minimal JSON only for observability
      this.app.get('/api-docs.json', (_req, res) => res.json(minimalSwaggerSpec));
    } else {
      try {
        const spec = buildSwaggerSpec();
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
        this.app.get('/api-docs.json', (_req, res) => res.json(spec));
      } catch (e) {
        // If anything slips through, still mount a minimal spec and note the degraded mode
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(minimalSwaggerSpec));
        this.app.get('/api-docs.json', (_req, res) => res.json(minimalSwaggerSpec));
      }
    }
    this.app.use('/api', routes);

    this.app.use('*', (req, res) => {
      res.status(404).json({
        status: 'error',
        message: 'Rota não encontrada',
        path: req.originalUrl,
      });
    });
  }

  private configureErrorHandling(): void {
    this.app.use(errorHandler);
  }
}

export default new App().app;