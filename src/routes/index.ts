import configuracaoSalaRoutes from './configuracoes-sala';
import configuracaoPrevisaoRoutes from './configuracoes-previsao';
import cursoRoutes from './cursos';
import salaRoutes from './salas';
import turmaRoutes from './turmas';
import previsaoRoutes from './previsoes';
import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/cursos', cursoRoutes);
router.use('/turmas', turmaRoutes);
router.use('/salas', salaRoutes);
router.use('/configuracoes-sala', configuracaoSalaRoutes);
router.use('/configuracoes-previsao', configuracaoPrevisaoRoutes);
router.use('/previsoes', previsaoRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API está funcionando corretamente',
    timestamp: new Date().toISOString(),
  });
});

export default router;
