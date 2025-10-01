import { Router } from 'express';
import { CursoController } from '../controllers';
import { authenticateToken } from '../middlewares';

const router = Router();
const cursoController = new CursoController();
router.use(authenticateToken);

/**
 * @swagger
 * /cursos:
 *   get:
 *     summary: Listar todos os cursos
 *     tags: [Cursos]
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
 *         description: Lista de cursos
 */
router.get('/', cursoController.getAllCursos);

/**
 * @swagger
 * /cursos/{id}:
 *   get:
 *     summary: Buscar curso por ID
 *     tags: [Cursos]
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
 *         description: Curso encontrado
 *       404:
 *         description: Curso não encontrado
 */
router.get('/:id', CursoController.validateId, cursoController.getCursoById);

/**
 * @swagger
 * /cursos:
 *   post:
 *     summary: Criar novo curso
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - duracao
 *               - evasao
 *             properties:
 *               nome:
 *                 type: string
 *               duracao:
 *                 type: integer
 *               evasao:
 *                 type: number
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 */
router.post('/', CursoController.validateCreate, cursoController.createCurso);

/**
 * @swagger
 * /cursos/{id}:
 *   put:
 *     summary: Atualizar curso
 *     tags: [Cursos]
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
 *               nome:
 *                 type: string
 *               duracao:
 *                 type: integer
 *               evasao:
 *                 type: number
 *     responses:
 *       200:
 *         description: Curso atualizado com sucesso
 */
router.put('/:id', CursoController.validateId, cursoController.updateCurso);

/**
 * @swagger
 * /cursos/{id}:
 *   delete:
 *     summary: Deletar curso
 *     tags: [Cursos]
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
 *         description: Curso deletado com sucesso
 */
router.delete('/:id', CursoController.validateId, cursoController.deleteCurso);

export default router;
