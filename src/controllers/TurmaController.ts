import { Response } from 'express';
import { TurmaService } from '../services';
import { sendSuccess, sendError, sendPaginatedResponse, HTTP_STATUS } from '../utils';
import { AuthenticatedRequest, validateRequired, validateId } from '../middlewares';
import { SalaService } from '../services/SalaService';

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
      if (turmaData.salaId) {
        const salaService = new SalaService();
        const sala = await salaService.getSalaById(turmaData.salaId);
        const configuracao = sala.configuracoes?.[0];
        if (!configuracao || typeof configuracao.capacidade !== 'number') {
          sendError(res, 'Capacidade da sala não encontrada', HTTP_STATUS.BAD_REQUEST);
          return;
        }
        if (turmaData.quantidadeAlunos > configuracao.capacidade) {
          sendError(res, 'A sala não comporta o número de alunos da turma', HTTP_STATUS.BAD_REQUEST);
          return;
        }
      }
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

      if (turmaData.salaId) {
        const salaService = new SalaService();
        const sala = await salaService.getSalaById(turmaData.salaId);
        const configuracao = sala.configuracoes?.[0];
        if (!configuracao || typeof configuracao.capacidade !== 'number') {
          sendError(res, 'Capacidade da sala não encontrada', HTTP_STATUS.BAD_REQUEST);
          return;
        }
        if (turmaData.quantidadeAlunos > configuracao.capacidade) {
          sendError(res, 'A sala não comporta o número de alunos da turma', HTTP_STATUS.BAD_REQUEST);
          return;
        }
      }
      const turma = await this.turmaService.updateTurma(parseInt(id), turmaData);
      sendSuccess(res, turma, 'Turma atualizada com sucesso');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  associarSala = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { turmaId, salaId } = req.body;
      const turma = await this.turmaService.getTurmaById(turmaId);
      const salaService = new SalaService();
      const sala = await salaService.getSalaById(salaId);

      if (turma.salaId) {
        sendError(res, 'A turma já está associada a uma sala', HTTP_STATUS.BAD_REQUEST);
        return;
      }

      const turmasComSala = await this.turmaService.getAllTurmas();
      if (turmasComSala.some(t => t.salaId === salaId)) {
        sendError(res, 'Esta sala já está associada a outra turma', HTTP_STATUS.BAD_REQUEST);
        return;
      }
      const configuracao = sala.configuracoes?.[0];
      if (!configuracao || typeof configuracao.capacidade !== 'number') {
        sendError(res, 'Capacidade da sala não encontrada', HTTP_STATUS.BAD_REQUEST);
        return;
      }
      if (turma.quantidadeAlunos > configuracao.capacidade) {
        sendError(res, 'A sala não comporta o número de alunos da turma', HTTP_STATUS.BAD_REQUEST);
        return;
      }
      turma.salaId = salaId;
      await this.turmaService.updateTurma(turmaId, turma);
      sendSuccess(res, turma, 'Sala associada à turma com sucesso');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  deleteTurma = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.turmaService.deleteTurma(parseInt(id));
      sendSuccess(res, null, 'Turma excluída com sucesso');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  static validateCreate = validateRequired(['cursoId', 'turno', 'periodoAtual', 'quantidadeAlunos', 'ano']);
  static validateId = validateId;
}
