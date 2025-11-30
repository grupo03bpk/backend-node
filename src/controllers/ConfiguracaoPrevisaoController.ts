import { Response } from 'express';
import { ConfiguracaoPrevisaoService } from '../services/ConfiguracaoPrevisaoService';
import { sendSuccess, sendError, sendPaginatedResponse, HTTP_STATUS } from '../utils';
import { AuthenticatedRequest, validateRequired, validateId } from '../middlewares';

export class ConfiguracaoPrevisaoController {
  private configuracaoPrevisaoService: ConfiguracaoPrevisaoService;

  constructor() {
    this.configuracaoPrevisaoService = new ConfiguracaoPrevisaoService();
  }

  getAllConfiguracoesPrevisao = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const configuracoesPrevisao = await this.configuracaoPrevisaoService.getAllConfiguracoesPrevisao();
      const configuracao = configuracoesPrevisao.length > 0 ? configuracoesPrevisao[0] : null;
      sendSuccess(res, configuracao, 'Configuração de previsão recuperada com sucesso');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  getConfiguracaoPrevisaoById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const configuracao = await this.configuracaoPrevisaoService.getConfiguracaoPrevisaoById(parseInt(id));
      sendSuccess(res, configuracao, 'Configuração de previsão encontrada');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  createConfiguracaoPrevisao = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const configuracaoData = req.body;
      const configuracao = await this.configuracaoPrevisaoService.createConfiguracaoPrevisao(configuracaoData);
      sendSuccess(res, configuracao, 'Configuração de previsão criada com sucesso', HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  updateConfiguracaoPrevisao = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const configuracaoData = req.body;
      const configuracao = await this.configuracaoPrevisaoService.updateConfiguracaoPrevisao(parseInt(id), configuracaoData);
      sendSuccess(res, configuracao, 'Configuração de previsão atualizada com sucesso');
    } catch (error: any) {
      sendError(res, error.message, error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  static validateCreate = validateRequired(['capacidadeSalaP', 'capacidadeSalaM', 'capacidadeSalaG', 'areaPorAlunoM2', 'taxaEvasaoPercentual']);
  static validateId = validateId;
}