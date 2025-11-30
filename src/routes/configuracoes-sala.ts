import { Router } from 'express';
import { ConfiguracaoSalaController } from '../controllers/ConfiguracaoSalaController';
import { authenticateToken } from '../middlewares';

const router = Router();
const configuracaoSalaController = new ConfiguracaoSalaController();
router.use(authenticateToken);

/**
 * @swagger
 * components:
 *   schemas:
 *     ConfiguracaoSalaInput:
 *       type: object
 *       required:
 *         - salaId
 *         - ano
 *         - semestre
 *         - tamanho
 *         - tipo
 *       properties:
 *         salaId:
 *           type: integer
 *           description: ID da sala
 *           example: 1
 *         ano:
 *           type: integer
 *           minimum: 2000
 *           maximum: 2100
 *           description: Ano da configuração
 *           example: 2024
 *         semestre:
 *           type: integer
 *           enum: [1, 2]
 *           description: Semestre da configuração
 *           example: 1
 *         tamanho:
 *           type: string
 *           enum: [P, M, G]
 *           description: Tamanho da sala (P=Pequena, M=Média, G=Grande)
 *           example: "M"
 *         tipo:
 *           type: string
 *           enum: [lab, aula]
 *           description: Tipo da sala
 *           example: "aula"
 *     ConfiguracaoSalaUpdateInput:
 *       type: object
 *       properties:
 *         salaId:
 *           type: integer
 *           description: ID da sala
 *           example: 1
 *         ano:
 *           type: integer
 *           minimum: 2000
 *           maximum: 2100
 *           description: Ano da configuração
 *           example: 2024
 *         semestre:
 *           type: integer
 *           enum: [1, 2]
 *           description: Semestre da configuração
 *           example: 1
 *         tamanho:
 *           type: string
 *           enum: [P, M, G]
 *           description: Tamanho da sala (P=Pequena, M=Média, G=Grande)
 *           example: "M"
 *         tipo:
 *           type: string
 *           enum: [lab, aula]
 *           description: Tipo da sala
 *           example: "aula"
 *     ConfiguracaoSala:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único da configuração
 *           example: 1
 *         salaId:
 *           type: integer
 *           description: ID da sala
 *           example: 1
 *         ano:
 *           type: integer
 *           description: Ano da configuração
 *           example: 2024
 *         semestre:
 *           type: integer
 *           description: Semestre da configuração
 *           example: 1
 *         tamanho:
 *           type: string
 *           description: Tamanho da sala
 *           example: "M"
 *         tipo:
 *           type: string
 *           description: Tipo da sala
 *           example: "aula"
 *         sala:
 *           $ref: '#/components/schemas/Sala'
 *         previsoes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Previsao'
 *           description: Previsões associadas a esta configuração
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
 * /configuracoes-sala:
 *   get:
 *     summary: Lista todas as configurações de sala
 *     tags: [Configurações de Sala]
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
 *       - in: query
 *         name: ano
 *         schema:
 *           type: integer
 *         description: Filtrar por ano
 *       - in: query
 *         name: semestre
 *         schema:
 *           type: integer
 *           enum: [1, 2]
 *         description: Filtrar por semestre
 *     responses:
 *       200:
 *         description: Lista de configurações de sala
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
 *                       example: "Configurações de sala recuperadas com sucesso"
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ConfiguracaoSala'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "Configurações de sala recuperadas com sucesso"
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ConfiguracaoSala'
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
router.get('/', configuracaoSalaController.getAllConfiguracoesSala);

/**
 * @swagger
 * /configuracoes-sala/periodo:
 *   get:
 *     summary: Busca configurações por ano e semestre
 *     tags: [Configurações de Sala]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ano
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ano
 *       - in: query
 *         name: semestre
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [1, 2]
 *         description: Semestre
 *     responses:
 *       200:
 *         description: Configurações do período encontradas
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
 *                   example: "Configurações do período recuperadas com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ConfiguracaoSala'
 *       400:
 *         description: Ano e semestre são obrigatórios
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/periodo', configuracaoSalaController.getConfiguracoesByAnoSemestre);

/**
 * @swagger
 * /configuracoes-sala/{id}:
 *   get:
 *     summary: Busca uma configuração específica por ID
 *     tags: [Configurações de Sala]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da configuração
 *     responses:
 *       200:
 *         description: Configuração encontrada
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
 *                   example: "Configuração de sala encontrada"
 *                 data:
 *                   $ref: '#/components/schemas/ConfiguracaoSala'
 *       404:
 *         description: Configuração não encontrada
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', ConfiguracaoSalaController.validateId, configuracaoSalaController.getConfiguracaoSalaById);

/**
 * @swagger
 * /configuracoes-sala/sala/{salaId}:
 *   get:
 *     summary: Busca configurações de uma sala específica
 *     tags: [Configurações de Sala]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da sala
 *     responses:
 *       200:
 *         description: Configurações da sala encontradas
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
 *                   example: "Configurações da sala recuperadas com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ConfiguracaoSala'
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/sala/:salaId', ConfiguracaoSalaController.validateId, configuracaoSalaController.getConfiguracoesBySala);

/**
 * @swagger
 * /configuracoes-sala:
 *   post:
 *     summary: Cria uma nova configuração de sala
 *     tags: [Configurações de Sala]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfiguracaoSalaInput'
 *     responses:
 *       201:
 *         description: Configuração criada com sucesso
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
 *                   example: "Configuração de sala criada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/ConfiguracaoSala'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido ou ausente
 *       409:
 *         description: Configuração já existe para este período
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', ConfiguracaoSalaController.validateCreate, configuracaoSalaController.createConfiguracaoSala);

/**
 * @swagger
 * /configuracoes-sala/{id}:
 *   put:
 *     summary: Atualiza uma configuração existente
 *     tags: [Configurações de Sala]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da configuração
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfiguracaoSalaUpdateInput'
 *     responses:
 *       200:
 *         description: Configuração atualizada com sucesso
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
 *                   example: "Configuração de sala atualizada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/ConfiguracaoSala'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Configuração não encontrada
 *       409:
 *         description: Conflito - configuração já existe para este período
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', ConfiguracaoSalaController.validateId, configuracaoSalaController.updateConfiguracaoSala);

/**
 * @swagger
 * /configuracoes-sala/{id}:
 *   delete:
 *     summary: Remove uma configuração
 *     tags: [Configurações de Sala]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da configuração
 *     responses:
 *       204:
 *         description: Configuração deletada com sucesso
 *       400:
 *         description: Configuração possui previsões associadas
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Configuração não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', ConfiguracaoSalaController.validateId, configuracaoSalaController.deleteConfiguracaoSala);

export default router;