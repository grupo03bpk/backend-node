import { Router } from 'express';
import { CursoController } from '../controllers';
import { authenticateToken } from '../middlewares';

const router = Router();
const cursoController = new CursoController();
router.use(authenticateToken);

/**
 * @swagger
 * components:
 *   schemas:
 *     TurmaInput:
 *       type: object
 *       properties:
 *         ano:
 *           type: number
 *           description: Ano de início da turma.
 *           example: 2024
 *         turno:
 *           type: string
 *           enum: [Manha, Tarde, Noite]
 *           description: Turno da turma.
 *           example: Noite
 *         quantidadeAlunos:
 *           type: number
 *           description: Número de alunos na turma.
 *           example: 45
 *         periodoAtual:
 *           type: number
 *           description: Período/semestre atual da turma.
 *           example: 1
 *     TurmaUpdateInput:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: (Opcional) ID da turma existente para atualizá-la. Se omitido, uma nova turma será criada.
 *           example: 15
 *     CursoInput:
 *       type: object
 *       required:
 *         - nome
 *         - duracao
 *       properties:
 *         nome:
 *           type: string
 *           description: O nome do curso.
 *           example: "Ciência da Computação"
 *         duracao:
 *           type: number
 *           description: Duração do curso em semestres.
 *           example: 8
 *         evasao:
 *           type: number
 *           description: Taxa de evasão percentual do curso.
 *           example: 12.5
 *         turmas:
 *           type: array
 *           description: (Opcional) Lista de turmas para criar junto com o curso.
 *           items:
 *             $ref: '#/components/schemas/TurmaInput'
 *     CursoUpdateInput:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           description: O nome do curso.
 *           example: "Ciência da Computação - Grade Nova"
 *         duracao:
 *           type: number
 *           description: Duração do curso em semestres.
 *           example: 9
 *         evasao:
 *           type: number
 *           description: Taxa de evasão percentual do curso.
 *           example: 11.0
 *         turmas:
 *           type: array
 *           description: Array completo de turmas para o curso. O backend irá adicionar, atualizar ou remover turmas para corresponder a este array.
 *           items:
 *             $ref: '#/components/schemas/TurmaUpdateInput'
 */

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
 *             $ref: '#/components/schemas/CursoInput'
 *           example:
 *             nome: "Engenharia de Software"
 *             duracao: 10
 *             evasao: 8.2
 *             turmas:
 *               - ano: 2025
 *                 turno: "Manha"
 *                 quantidadeAlunos: 50
 *                 periodoAtual: 1
 *               - ano: 2025
 *                 turno: "Noite"
 *                 quantidadeAlunos: 40
 *                 periodoAtual: 1
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
 *             $ref: '#/components/schemas/CursoUpdateInput'
 *           examples:
 *             apenas_curso:
 *               summary: Atualizando somente dados do curso
 *               value:
 *                 nome: "Engenharia de Software - Grade Nova"
 *                 duracao: 9
 *             gerenciando_turmas:
 *               summary: Adicionando, atualizando e removendo turmas
 *               value:
 *                 nome: "Engenharia de Software"
 *                 turmas:
 *                   - id: 2 # Atualiza a turma com ID 2
 *                     turno: "Noite"
 *                     quantidadeAlunos: 55
 *                   - ano: 2026 # Adiciona uma nova turma (sem ID)
 *                     turno: "Manha"
 *                     quantidadeAlunos: 40
 *                     periodoAtual: 1
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
