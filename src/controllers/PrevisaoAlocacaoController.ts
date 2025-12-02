import { Response } from 'express';
import { PrevisaoAlocacaoService } from '../services/PrevisaoAlocacaoService';
import { sendSuccess, sendError, HTTP_STATUS } from '../utils';
import { AuthenticatedRequest, validateRequired, validateId } from '../middlewares';

export class PrevisaoAlocacaoController {
  static previsaoAlocacaoService = new PrevisaoAlocacaoService();

  static async gerarPrevisao(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const dadosEntrada = req.body;
      const resultado = await PrevisaoAlocacaoController.previsaoAlocacaoService.gerarPrevisao(dadosEntrada);
      sendSuccess(res, resultado, 'Previsão gerada com sucesso');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async salvarPrevisao(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { nome, dados } = req.body;
      const previsao = await PrevisaoAlocacaoController.previsaoAlocacaoService.salvarPrevisao(nome, dados);
      sendSuccess(res, previsao, 'Previsão salva com sucesso', HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async listarPrevisoes(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const previsoes = await PrevisaoAlocacaoController.previsaoAlocacaoService.listarPrevisoes();
      sendSuccess(res, previsoes, 'Previsões listadas com sucesso');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async buscarPrevisaoPorId(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const previsao = await PrevisaoAlocacaoController.previsaoAlocacaoService.buscarPrevisaoPorId(parseInt(id));
      sendSuccess(res, previsao, 'Previsão encontrada');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async excluirPrevisao(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await previsaoAlocacaoService.previsaoAlocacaoRepository.delete(Number(id));
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao excluir previsão', detalhes: error.message });
    }
  }

  static validateCreate = validateRequired(['nome', 'dados']);
  static validateId = validateId;
}

export default PrevisaoAlocacaoController;
