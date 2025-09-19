import { Request, Response } from 'express';
import { AuthService } from '../services';
import { sendSuccess, sendError, HTTP_STATUS } from '../utils';
import { validateRequired } from '../middlewares';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, senha } = req.body;

      const result = await this.authService.login({ username, senha });

      sendSuccess(res, result, 'Login realizado com sucesso');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  // Middleware de validação para login
  static validateLogin = validateRequired(['username', 'senha']);
}
