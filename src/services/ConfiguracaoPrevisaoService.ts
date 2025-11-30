import { ConfiguracaoPrevisao } from '../entities';
import { AppError } from '../middlewares';
import { ConfiguracaoPrevisaoRepository } from '../repositories';
import { HTTP_STATUS } from '../utils/constants';

export interface CreateConfiguracaoPrevisaoData {
  capacidadeSalaP: number;
  capacidadeSalaM: number;
  capacidadeSalaG: number;
  areaPorAlunoM2: number;
  taxaEvasaoPercentual: number;
}

export interface UpdateConfiguracaoPrevisaoData {
  capacidadeSalaP?: number;
  capacidadeSalaM?: number;
  capacidadeSalaG?: number;
  areaPorAlunoM2?: number;
  taxaEvasaoPercentual?: number;
}

export class ConfiguracaoPrevisaoService {
  private configuracaoPrevisaoRepository: ConfiguracaoPrevisaoRepository;

  constructor() {
    this.configuracaoPrevisaoRepository = new ConfiguracaoPrevisaoRepository();
  }

  async getAllConfiguracoesPrevisao(): Promise<ConfiguracaoPrevisao[]> {
    return this.configuracaoPrevisaoRepository.findAll();
  }

  async getConfiguracoesPrevisaoWithPagination(page: number, limit: number) {
    const [configuracoesPrevisao, total] = await this.configuracaoPrevisaoRepository.findWithPagination(page, limit);
    return {
      configuracoesPrevisao,
      total,
      currentPage: page,
    };
  }

  async getConfiguracaoPrevisaoById(id: number): Promise<ConfiguracaoPrevisao> {
    const configuracao = await this.configuracaoPrevisaoRepository.findById(id);
    if (!configuracao) {
      throw new AppError('Configuração de previsão não encontrada', HTTP_STATUS.NOT_FOUND);
    }
    return configuracao;
  }

  async createConfiguracaoPrevisao(configuracaoData: CreateConfiguracaoPrevisaoData): Promise<ConfiguracaoPrevisao> {
    const existingConfig = await this.configuracaoPrevisaoRepository.findAll();
    if (existingConfig.length > 0) {
      throw new AppError('Já existe uma configuração de previsão. Apenas uma configuração é permitida.', HTTP_STATUS.BAD_REQUEST);
    }

    this.validateConfiguracaoPrevisaoData(configuracaoData);

    return this.configuracaoPrevisaoRepository.create(configuracaoData);
  }

  async updateConfiguracaoPrevisao(id: number, configuracaoData: UpdateConfiguracaoPrevisaoData): Promise<ConfiguracaoPrevisao> {
    await this.getConfiguracaoPrevisaoById(id);

    this.validateConfiguracaoPrevisaoData(configuracaoData, true);
    const updatedConfiguracao = await this.configuracaoPrevisaoRepository.update(id, configuracaoData);
    if (!updatedConfiguracao) {
      throw new AppError('Erro ao atualizar configuração de previsão', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
    return updatedConfiguracao;
  }

  private validateConfiguracaoPrevisaoData(configuracaoData: Partial<CreateConfiguracaoPrevisaoData>, isUpdate = false): void {
    if (!isUpdate) {
      if (configuracaoData.capacidadeSalaP === undefined || configuracaoData.capacidadeSalaP === null) {
        throw new AppError('Capacidade da sala P é obrigatória', HTTP_STATUS.BAD_REQUEST);
      }
      if (configuracaoData.capacidadeSalaM === undefined || configuracaoData.capacidadeSalaM === null) {
        throw new AppError('Capacidade da sala M é obrigatória', HTTP_STATUS.BAD_REQUEST);
      }
      if (configuracaoData.capacidadeSalaG === undefined || configuracaoData.capacidadeSalaG === null) {
        throw new AppError('Capacidade da sala G é obrigatória', HTTP_STATUS.BAD_REQUEST);
      }
      if (configuracaoData.areaPorAlunoM2 === undefined || configuracaoData.areaPorAlunoM2 === null) {
        throw new AppError('Área por aluno é obrigatória', HTTP_STATUS.BAD_REQUEST);
      }
      if (configuracaoData.taxaEvasaoPercentual === undefined || configuracaoData.taxaEvasaoPercentual === null) {
        throw new AppError('Taxa de evasão é obrigatória', HTTP_STATUS.BAD_REQUEST);
      }
    }

    if (configuracaoData.capacidadeSalaP !== undefined) {
      if (!Number.isInteger(configuracaoData.capacidadeSalaP) || configuracaoData.capacidadeSalaP <= 0) {
        throw new AppError('Capacidade da sala P deve ser um número inteiro positivo', HTTP_STATUS.BAD_REQUEST);
      }
      if (configuracaoData.capacidadeSalaP > 100) {
        throw new AppError('Capacidade da sala P deve ser no máximo 100 alunos', HTTP_STATUS.BAD_REQUEST);
      }
    }

    if (configuracaoData.capacidadeSalaM !== undefined) {
      if (!Number.isInteger(configuracaoData.capacidadeSalaM) || configuracaoData.capacidadeSalaM <= 0) {
        throw new AppError('Capacidade da sala M deve ser um número inteiro positivo', HTTP_STATUS.BAD_REQUEST);
      }
      if (configuracaoData.capacidadeSalaM > 150) {
        throw new AppError('Capacidade da sala M deve ser no máximo 150 alunos', HTTP_STATUS.BAD_REQUEST);
      }
    }

    if (configuracaoData.capacidadeSalaG !== undefined) {
      if (!Number.isInteger(configuracaoData.capacidadeSalaG) || configuracaoData.capacidadeSalaG <= 0) {
        throw new AppError('Capacidade da sala G deve ser um número inteiro positivo', HTTP_STATUS.BAD_REQUEST);
      }
      if (configuracaoData.capacidadeSalaG > 200) {
        throw new AppError('Capacidade da sala G deve ser no máximo 200 alunos', HTTP_STATUS.BAD_REQUEST);
      }
    }

    if (configuracaoData.areaPorAlunoM2 !== undefined) {
      if (configuracaoData.areaPorAlunoM2 <= 0 || configuracaoData.areaPorAlunoM2 > 10) {
        throw new AppError('Área por aluno deve estar entre 0.01 e 10.00 m²', HTTP_STATUS.BAD_REQUEST);
      }
    }

    if (configuracaoData.taxaEvasaoPercentual !== undefined) {
      if (configuracaoData.taxaEvasaoPercentual < 0 || configuracaoData.taxaEvasaoPercentual > 100) {
        throw new AppError('Taxa de evasão deve estar entre 0 e 100%', HTTP_STATUS.BAD_REQUEST);
      }
    }
  }
}