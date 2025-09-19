import { Router } from 'express';
import { UserController } from '../controllers';
import { authenticateToken, requireAdmin } from '../middlewares';

const router = Router();
const userController = new UserController();

// Todas as rotas de usuário requerem autenticação
router.use(authenticateToken);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Users]
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
 *         description: Lista de usuários
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     tags: [Users]
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
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', UserController.validateId, userController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar novo usuário (somente admin)
 *     tags: [Users]
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
 *               - username
 *               - senha
 *               - perfil
 *             properties:
 *               nome:
 *                 type: string
 *               username:
 *                 type: string
 *               senha:
 *                 type: string
 *               perfil:
 *                 type: string
 *                 enum: [admin, coordenador]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post('/', requireAdmin, UserController.validateCreate, userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualizar usuário (somente admin)
 *     tags: [Users]
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
 *         description: Usuário atualizado com sucesso
 */
router.put('/:id', requireAdmin, UserController.validateId, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deletar usuário (somente admin)
 *     tags: [Users]
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
 *         description: Usuário deletado com sucesso
 */
router.delete('/:id', requireAdmin, UserController.validateId, userController.deleteUser);

export default router;
