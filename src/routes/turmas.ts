import { Router } from 'express';
import { TurmaController } from '../controllers';
import { authenticateToken, requireAdmin } from '../middlewares';

const router = Router();
const turmaController = new TurmaController();

router.use(authenticateToken);

/**
 * @swagger
 * /turmas:
 *   get:
 *     summary: Listar todas as turmas
 *     tags: [Turmas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite de itens por página
 *     responses:
 *       200:
 *         description: Lista de turmas
 */
router.get('/', turmaController.getAllTurmas);

/**
 * @swagger
 * /turmas/{id}:
 *   get:
 *     summary: Buscar turma por ID
 *     tags: [Turmas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turma encontrada
 *       404:
 *         description: Turma não encontrada
 */
router.get('/:id', TurmaController.validateId, turmaController.getTurmaById);

/**
 * @swagger
 * /turmas:
 *   post:
 *     summary: Criar nova turma (somente admin)
 *     tags: [Turmas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cursoId
 *               - turno
 *               - periodoAtual
 *               - quantidadeAlunos
 *               - ano
 *             properties:
 *               cursoId:
 *                 type: integer
 *               turno:
 *                 type: string
 *                 enum: [manha, tarde, noite]
 *               periodoAtual:
 *                 type: integer
 *               quantidadeAlunos:
 *                 type: integer
 *               ano:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Turma criada com sucesso
 */
router.post('/', requireAdmin, TurmaController.validateCreate, turmaController.createTurma);

/**
 * @swagger
 * /turmas/{id}:
 *   put:
 *     summary: Atualizar turma (somente admin)
 *     tags: [Turmas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cursoId:
 *                 type: integer
 *               turno:
 *                 type: string
 *                 enum: [manha, tarde, noite]
 *               periodoAtual:
 *                 type: integer
 *               quantidadeAlunos:
 *                 type: integer
 *               ano:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Turma atualizada com sucesso
 */
router.put('/:id', requireAdmin, TurmaController.validateId, turmaController.updateTurma);

/**
 * @swagger
 * /turmas/{id}:
 *   delete:
 *     summary: Deletar turma (somente admin)
 *     tags: [Turmas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Turma deletada com sucesso
 */
router.delete('/:id', requireAdmin, TurmaController.validateId, turmaController.deleteTurma);

export default router;
