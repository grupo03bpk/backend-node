import { Router } from 'express';
import { ConfiguracaoPrevisaoController } from '../controllers/ConfiguracaoPrevisaoController';
import { authenticateToken } from '../middlewares';

const router = Router();
const configuracaoPrevisaoController = new ConfiguracaoPrevisaoController();
router.use(authenticateToken);

/**
 * @swagger
 * components:
 *   schemas:
 *     ConfiguracaoPrevisaoInput:
 *       type: object
 *       required:
 *         - capacidadeSalaP
 *         - capacidadeSalaM
 *         - capacidadeSalaG
 *         - areaPorAlunoM2
 *         - taxaEvasaoPercentual
 *       properties:
 *         capacidadeSalaP:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           description: Capacidade máxima de alunos para sala pequena (P)
 *           example: 25
 *         capacidadeSalaM:
 *           type: integer
 *           minimum: 1
 *           maximum: 150
 *           description: Capacidade máxima de alunos para sala média (M)
 *           example: 45
 *         capacidadeSalaG:
 *           type: integer
 *           minimum: 1
 *           maximum: 200
 *           description: Capacidade máxima de alunos para sala grande (G)
 *           example: 80
 *         areaPorAlunoM2:
 *           type: number
 *           format: decimal
 *           minimum: 0.01
 *           maximum: 10.00
 *           description: Área em metros quadrados necessária por aluno
 *           example: 1.5
 *         taxaEvasaoPercentual:
 *           type: number
 *           format: decimal
 *           minimum: 0
 *           maximum: 100
 *           description: Taxa de evasão em porcentagem
 *           example: 15.5
 *     ConfiguracaoPrevisaoUpdateInput:
 *       type: object
 *       properties:
 *         capacidadeSalaP:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           description: Capacidade máxima de alunos para sala pequena (P)
 *           example: 25
 *         capacidadeSalaM:
 *           type: integer
 *           minimum: 1
 *           maximum: 150
 *           description: Capacidade máxima de alunos para sala média (M)
 *           example: 45
 *         capacidadeSalaG:
 *           type: integer
 *           minimum: 1
 *           maximum: 200
 *           description: Capacidade máxima de alunos para sala grande (G)
 *           example: 80
 *         areaPorAlunoM2:
 *           type: number
 *           format: decimal
 *           minimum: 0.01
 *           maximum: 10.00
 *           description: Área em metros quadrados necessária por aluno
 *           example: 1.5
 *         taxaEvasaoPercentual:
 *           type: number
 *           format: decimal
 *           minimum: 0
 *           maximum: 100
 *           description: Taxa de evasão em porcentagem
 *           example: 15.5
 *     ConfiguracaoPrevisao:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único da configuração
 *           example: 1
 *         capacidadeSalaP:
 *           type: integer
 *           description: Capacidade máxima de alunos para sala pequena (P)
 *           example: 25
 *         capacidadeSalaM:
 *           type: integer
 *           description: Capacidade máxima de alunos para sala média (M)
 *           example: 45
 *         capacidadeSalaG:
 *           type: integer
 *           description: Capacidade máxima de alunos para sala grande (G)
 *           example: 80
 *         areaPorAlunoM2:
 *           type: number
 *           format: decimal
 *           description: Área em metros quadrados necessária por aluno
 *           example: 1.5
 *         taxaEvasaoPercentual:
 *           type: number
 *           format: decimal
 *           description: Taxa de evasão em porcentagem
 *           example: 15.5
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
 * /api/configuracoes-previsao:
 *   get:
 *     summary: Busca a configuração de previsão (única)
 *     tags: [Configurações de Previsão]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuração de previsão recuperada com sucesso
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
 *                   example: "Configuração de previsão recuperada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/ConfiguracaoPrevisao'
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', configuracaoPrevisaoController.getAllConfiguracoesPrevisao);

/**
 * @swagger
 * /api/configuracoes-previsao/{id}:
 *   get:
 *     summary: Busca uma configuração específica por ID
 *     tags: [Configurações de Previsão]
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
 *                   example: "Configuração de previsão encontrada"
 *                 data:
 *                   $ref: '#/components/schemas/ConfiguracaoPrevisao'
 *       404:
 *         description: Configuração não encontrada
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', ConfiguracaoPrevisaoController.validateId, configuracaoPrevisaoController.getConfiguracaoPrevisaoById);

/**
 * @swagger
 * /api/configuracoes-previsao:
 *   post:
 *     summary: Cria a configuração de previsão (apenas uma é permitida)
 *     tags: [Configurações de Previsão]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfiguracaoPrevisaoInput'
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
 *                   example: "Configuração de previsão criada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/ConfiguracaoPrevisao'
 *       400:
 *         description: Dados inválidos ou configuração já existe
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', ConfiguracaoPrevisaoController.validateCreate, configuracaoPrevisaoController.createConfiguracaoPrevisao);

/**
 * @swagger
 * /api/configuracoes-previsao/{id}:
 *   put:
 *     summary: Atualiza uma configuração existente
 *     tags: [Configurações de Previsão]
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
 *             $ref: '#/components/schemas/ConfiguracaoPrevisaoUpdateInput'
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
 *                   example: "Configuração de previsão atualizada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/ConfiguracaoPrevisao'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Configuração não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', ConfiguracaoPrevisaoController.validateId, configuracaoPrevisaoController.updateConfiguracaoPrevisao);

export default router;