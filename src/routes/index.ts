import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import cursoRoutes from './cursos';
// import turmaRoutes from './turmas';
// import salaRoutes from './salas';
// import configuracaoSalaRoutes from './configuracoes-sala';
// import previsaoRoutes from './previsoes';

const router = Router();

// Definir todas as rotas da aplicação
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/cursos', cursoRoutes);
// router.use('/turmas', turmaRoutes);
// router.use('/salas', salaRoutes);
// router.use('/configuracoes-sala', configuracaoSalaRoutes);
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
