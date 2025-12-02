import { Response } from 'express';
import { SalaService } from '../services/SalaService';
import { sendSuccess, sendError, sendPaginatedResponse, HTTP_STATUS } from '../utils';
import { AuthenticatedRequest, validateRequired, validateId } from '../middlewares';

export class SalaController {
  private salaService: SalaService;

  constructor() {
    this.salaService = new SalaService();
  }

  getAllSalas = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (req.query.page || req.query.limit) {
        const result = await this.salaService.getSalasWithPagination(page, limit);
        sendPaginatedResponse(
          res,
          result.salas,
          result.currentPage,
          limit,
          result.total,
          'Salas recuperadas com sucesso'
        );
      } else {
        const salas = await this.salaService.getAllSalas();
        sendSuccess(res, salas, 'Salas recuperadas com sucesso');
      }
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  getSalaById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const sala = await this.salaService.getSalaById(parseInt(id));
      sendSuccess(res, sala, 'Sala encontrada');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  createSala = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const salaData = req.body;
      const sala = await this.salaService.createSala(salaData);
      sendSuccess(res, sala, 'Sala criada com sucesso', HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  updateSala = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const salaData = req.body;
      const sala = await this.salaService.updateSala(parseInt(id), salaData);
      sendSuccess(res, sala, 'Sala atualizada com sucesso');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  deleteSala = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.salaService.deleteSala(parseInt(id));
      sendSuccess(res, null, 'Sala deletada com sucesso', HTTP_STATUS.NO_CONTENT);
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  
  static validateCreate = validateRequired(['numero', 'bloco']);
  static validateId = validateId;
}