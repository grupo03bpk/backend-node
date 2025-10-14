import configuracaoSalaRoutes from './configuracoes-sala';
import cursoRoutes from './cursos';
import salaRoutes from './salas';
import turmaRoutes from './turmas';
// import previsaoRoutes from './previsoes';
import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';

const router = Router();

// Definir todas as rotas da aplicação
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/cursos', cursoRoutes);
router.use('/turmas', turmaRoutes);
router.use('/salas', salaRoutes);
router.use('/configuracoes-sala', configuracaoSalaRoutes);
// router.use('/previsoes', previsaoRoutes);

// Rota de health check
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API está funcionando corretamente',
    timestamp: new Date().toISOString(),
  });
});

export default router;
