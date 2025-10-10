import { Response } from 'express';
import { ConfiguracaoSalaService } from '../services/ConfiguracaoSalaService';
import { sendSuccess, sendError, sendPaginatedResponse, HTTP_STATUS } from '../utils';
import { AuthenticatedRequest, validateRequired, validateId } from '../middlewares';

export class ConfiguracaoSalaController {
  private configuracaoSalaService: ConfiguracaoSalaService;

  constructor() {
    this.configuracaoSalaService = new ConfiguracaoSalaService();
  }

  getAllConfiguracoesSala = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (req.query.page || req.query.limit) {
        const result = await this.configuracaoSalaService.getConfiguracoesSalaWithPagination(page, limit);
        sendPaginatedResponse(
          res,
          result.configuracoesSala,
          result.currentPage,
          limit,
          result.total,
          'Configurações de sala recuperadas com sucesso'
        );
      } else {
        const configuracoesSala = await this.configuracaoSalaService.getAllConfiguracoesSala();
        sendSuccess(res, configuracoesSala, 'Configurações de sala recuperadas com sucesso');
      }
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  getConfiguracaoSalaById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const configuracao = await this.configuracaoSalaService.getConfiguracaoSalaById(parseInt(id));
      sendSuccess(res, configuracao, 'Configuração de sala encontrada');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  getConfiguracoesBySala = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { salaId } = req.params;
      const configuracoes = await this.configuracaoSalaService.getConfiguracoesBySala(parseInt(salaId));
      sendSuccess(res, configuracoes, 'Configurações da sala recuperadas com sucesso');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  getConfiguracoesByAnoSemestre = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { ano, semestre } = req.query;
      if (!ano || !semestre) {
        sendError(res, 'Ano e semestre são obrigatórios', HTTP_STATUS.BAD_REQUEST);
        return;
      }
      const configuracoes = await this.configuracaoSalaService.getConfiguracoesByAnoSemestre(
        parseInt(ano as string),
        parseInt(semestre as string)
      );
      sendSuccess(res, configuracoes, 'Configurações do período recuperadas com sucesso');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  createConfiguracaoSala = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const configuracaoData = req.body;
      const configuracao = await this.configuracaoSalaService.createConfiguracaoSala(configuracaoData);
      sendSuccess(res, configuracao, 'Configuração de sala criada com sucesso', HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  updateConfiguracaoSala = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const configuracaoData = req.body;
      const configuracao = await this.configuracaoSalaService.updateConfiguracaoSala(parseInt(id), configuracaoData);
      sendSuccess(res, configuracao, 'Configuração de sala atualizada com sucesso');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  deleteConfiguracaoSala = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.configuracaoSalaService.deleteConfiguracaoSala(parseInt(id));
      sendSuccess(res, null, 'Configuração de sala deletada com sucesso', HTTP_STATUS.NO_CONTENT);
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  // Middlewares de validação
  static validateCreate = validateRequired(['salaId', 'ano', 'semestre', 'tamanho', 'tipo']);
  static validateId = validateId;
}