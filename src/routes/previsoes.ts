import PrevisaoAlocacaoController from '../controllers/PrevisaoAlocacaoController';
import ExportPrevisaoController from '../controllers/ExportPrevisaoController';
import { Router } from 'express';
import { authenticateToken } from '../middlewares';

const router = Router();
router.use(authenticateToken);

router.post('/gerar', PrevisaoAlocacaoController.gerarPrevisao);
router.post('/salvar', PrevisaoAlocacaoController.validateCreate, PrevisaoAlocacaoController.salvarPrevisao);
router.get('/', PrevisaoAlocacaoController.listarPrevisoes);
router.get('/:id', PrevisaoAlocacaoController.validateId, PrevisaoAlocacaoController.buscarPrevisaoPorId);
router.get('/:id/exportar', ExportPrevisaoController.exportar);

export default router;
