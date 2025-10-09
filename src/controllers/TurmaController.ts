import { Response } from 'express';
import { TurmaService } from '../services';
import { sendSuccess, sendError, sendPaginatedResponse, HTTP_STATUS } from '../utils';
import { AuthenticatedRequest, validateRequired, validateId } from '../middlewares';

export class TurmaController {
  private turmaService: TurmaService;

  constructor() {
    this.turmaService = new TurmaService();
  }

  getAllTurmas = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (req.query.page || req.query.limit) {
        const result = await this.turmaService.getTurmasWithPagination(page, limit);
        sendPaginatedResponse(
          res,
          result.turmas,
          result.currentPage,
          limit,
          result.total,
          'Turmas recuperadas com sucesso'
        );
      } else {
        const turmas = await this.turmaService.getAllTurmas();
        sendSuccess(res, turmas, 'Turmas recuperadas com sucesso');
      }
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  getTurmaById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const turma = await this.turmaService.getTurmaById(parseInt(id));
      sendSuccess(res, turma, 'Turma encontrada');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  createTurma = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const turmaData = req.body;
      const turma = await this.turmaService.createTurma(turmaData);
      sendSuccess(res, turma, 'Turma criada com sucesso', HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  updateTurma = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const turmaData = req.body;
      const turma = await this.turmaService.updateTurma(parseInt(id), turmaData);
      sendSuccess(res, turma, 'Turma atualizada com sucesso');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  deleteTurma = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.turmaService.deleteTurma(parseInt(id));
      sendSuccess(res, null, 'Turma deletada com sucesso', HTTP_STATUS.NO_CONTENT);
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  static validateCreate = validateRequired(['cursoId', 'turno', 'periodoAtual', 'quantidadeAlunos', 'ano']);
  static validateId = validateId;
}
