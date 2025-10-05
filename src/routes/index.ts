import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';

const router = Router();

// Definir todas as rotas da aplicação
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
// Additional route modules (cursos, turmas, salas, configuracoes-sala, previsoes)
// are not present in this workspace. Add them when implementing those features.

// Rota de health check
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API está funcionando corretamente',
    timestamp: new Date().toISOString(),
  });
});

export default router;
