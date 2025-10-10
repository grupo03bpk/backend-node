import { Router } from 'express';
import { SalaController } from '../controllers/SalaController';
import { authenticateToken } from '../middlewares';

const router = Router();
const salaController = new SalaController();
router.use(authenticateToken);

/**
 * @swagger
 * components:
 *   schemas:
 *     SalaInput:
 *       type: object
 *       required:
 *         - numero
 *         - bloco
 *       properties:
 *         numero:
 *           type: string
 *           maxLength: 20
 *           description: Número da sala
 *           example: "101"
 *         bloco:
 *           type: string
 *           maxLength: 10
 *           description: Bloco onde a sala está localizada
 *           example: "A"
 *     SalaUpdateInput:
 *       type: object
 *       properties:
 *         numero:
 *           type: string
 *           maxLength: 20
 *           description: Número da sala
 *           example: "101"
 *         bloco:
 *           type: string
 *           maxLength: 10
 *           description: Bloco onde a sala está localizada
 *           example: "A"
 *     Sala:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único da sala
 *           example: 1
 *         numero:
 *           type: string
 *           description: Número da sala
 *           example: "101"
 *         bloco:
 *           type: string
 *           description: Bloco onde a sala está localizada
 *           example: "A"
 *         configuracoes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ConfiguracaoSala'
 *           description: Configurações históricas da sala
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de última atualização
 */

/**
 * @swagger
 * /api/salas:
 *   get:
 *     summary: Lista todas as salas
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número da página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Número de itens por página
 *     responses:
 *       200:
 *         description: Lista de salas
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "Salas recuperadas com sucesso"
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Sala'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "Salas recuperadas com sucesso"
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Sala'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', salaController.getAllSalas);

/**
 * @swagger
 * /api/salas/{id}:
 *   get:
 *     summary: Busca uma sala específica por ID
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da sala
 *     responses:
 *       200:
 *         description: Sala encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Sala encontrada"
 *                 data:
 *                   $ref: '#/components/schemas/Sala'
 *       404:
 *         description: Sala não encontrada
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', SalaController.validateId, salaController.getSalaById);

/**
 * @swagger
 * /api/salas:
 *   post:
 *     summary: Cria uma nova sala
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalaInput'
 *     responses:
 *       201:
 *         description: Sala criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Sala criada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Sala'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido ou ausente
 *       409:
 *         description: Sala já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', SalaController.validateCreate, salaController.createSala);

/**
 * @swagger
 * /api/salas/{id}:
 *   put:
 *     summary: Atualiza uma sala existente
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da sala
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalaUpdateInput'
 *     responses:
 *       200:
 *         description: Sala atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Sala atualizada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Sala'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Sala não encontrada
 *       409:
 *         description: Conflito - sala já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', SalaController.validateId, salaController.updateSala);

/**
 * @swagger
 * /api/salas/{id}:
 *   delete:
 *     summary: Remove uma sala
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da sala
 *     responses:
 *       204:
 *         description: Sala deletada com sucesso
 *       400:
 *         description: Sala possui configurações associadas
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Sala não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', SalaController.validateId, salaController.deleteSala);

export default router;