import { Response } from 'express';
import { AuthenticatedRequest, validateId, validateRequired } from '../middlewares';
import { CursoRepository } from '../repositories';
import { CursoService } from '../services/CursoService';
import { HTTP_STATUS, sendError, sendPaginatedResponse, sendSuccess } from '../utils';

export class CursoController {
  private cursoService: CursoService;

  constructor() {
    this.cursoService = new CursoService(new CursoRepository());
  }

  getAllCursos = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (req.query.page || req.query.limit) {
        const result = await this.cursoService.getCursosWithPagination(page, limit);
        sendPaginatedResponse(
          res,
          result.cursos,
          result.currentPage,
          limit,
          result.total,
          'Cursos recuperados com sucesso'
        );
      } else {
        const cursos = await this.cursoService.getAllCursos();
        sendSuccess(res, cursos, 'Cursos recuperados com sucesso');
      }
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  getCursoById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const curso = await this.cursoService.getCursoById(parseInt(id));
      sendSuccess(res, curso, 'Curso encontrado');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  createCurso = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const cursoData = req.body;
      const curso = await this.cursoService.createCurso(cursoData);
      sendSuccess(res, curso, 'Curso criado com sucesso', HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  updateCurso = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const cursoData = req.body;
      const curso = await this.cursoService.updateCurso(parseInt(id), cursoData);
      sendSuccess(res, curso, 'Curso atualizado com sucesso');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  deleteCurso = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.cursoService.deleteCurso(parseInt(id));
      sendSuccess(res, null, 'Curso deletado com sucesso', HTTP_STATUS.NO_CONTENT);
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  // Middlewares de validação
  static validateCreate = validateRequired(['nome', 'duracao', 'evasao']);
  static validateId = validateId;
}
