import { Response } from 'express';
import { AuthenticatedRequest, validateId, validateRequired } from '../middlewares';
import { UserRepository } from '../repositories';
import { UserService } from '../services';
import { HTTP_STATUS, sendError, sendPaginatedResponse, sendSuccess } from '../utils';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService(new UserRepository());
  }

  getAllUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (req.query.page || req.query.limit) {
        const result = await this.userService.getUsersWithPagination(page, limit);
        sendPaginatedResponse(
          res,
          result.users,
          result.currentPage,
          limit,
          result.total,
          'Usuários recuperados com sucesso'
        );
      } else {
        const users = await this.userService.getAllUsers();
        sendSuccess(res, users, 'Usuários recuperados com sucesso');
      }
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  getUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(parseInt(id));
      sendSuccess(res, user, 'Usuário encontrado');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  createUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userData = req.body;
      const user = await this.userService.createUser(userData);
      sendSuccess(res, user, 'Usuário criado com sucesso', HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await this.userService.updateUser(parseInt(id), userData);
      sendSuccess(res, user, 'Usuário atualizado com sucesso');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(parseInt(id));
      sendSuccess(res, null, 'Usuário deletado com sucesso', HTTP_STATUS.NO_CONTENT);
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  // Middlewares de validação
  static validateCreate = validateRequired(['nome', 'username', 'senha', 'perfil']);
  static validateId = validateId;
}
