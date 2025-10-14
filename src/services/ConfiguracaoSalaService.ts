import { ConfiguracaoSala, TamanhoSalaEnum, TipoSalaEnum } from '../entities';
import { AppError } from '../middlewares';
import { ConfiguracaoSalaRepository } from '../repositories';
import { HTTP_STATUS } from '../utils/constants';

export interface CreateConfiguracaoSalaData {
  salaId: number;
  ano: number;
  semestre: number;
  tamanho: TamanhoSalaEnum;
  tipo: TipoSalaEnum;
}

export interface UpdateConfiguracaoSalaData {
  salaId?: number;
  ano?: number;
  semestre?: number;
  tamanho?: TamanhoSalaEnum;
  tipo?: TipoSalaEnum;
}

export class ConfiguracaoSalaService {
  private configuracaoSalaRepository: ConfiguracaoSalaRepository;

  constructor(configuracaoSalaRepository?: ConfiguracaoSalaRepository) {
    this.configuracaoSalaRepository =
      configuracaoSalaRepository ?? new ConfiguracaoSalaRepository();
  }

  // Métodos compatíveis com os testes automatizados
  async findAll() {
    return this.getAllConfiguracoesSala();
  }

  async findById(id: number) {
    return this.getConfiguracaoSalaById(id);
  }

  async create(data: CreateConfiguracaoSalaData) {
    return this.createConfiguracaoSala(data);
  }

  async getAllConfiguracoesSala(): Promise<ConfiguracaoSala[]> {
    return this.configuracaoSalaRepository.findAll();
  }

  async getConfiguracoesSalaWithPagination(page: number, limit: number) {
    const [configuracoesSala, total] = await this.configuracaoSalaRepository.findWithPagination(
      page,
      limit
    );
    return {
      configuracoesSala,
      total,
      currentPage: page,
    };
  }

  async getConfiguracaoSalaById(id: number): Promise<ConfiguracaoSala> {
    const configuracao = await this.configuracaoSalaRepository.findById(id);
    if (!configuracao) {
      throw new AppError('Configuração de sala não encontrada', HTTP_STATUS.NOT_FOUND);
    }
    return configuracao;
  }

  async getConfiguracoesBySala(salaId: number): Promise<ConfiguracaoSala[]> {
    return this.configuracaoSalaRepository.findBySala(salaId);
  }

  async getConfiguracoesByAnoSemestre(ano: number, semestre: number): Promise<ConfiguracaoSala[]> {
    return this.configuracaoSalaRepository.findByAnoSemestre(ano, semestre);
  }

  async createConfiguracaoSala(
    configuracaoData: CreateConfiguracaoSalaData
  ): Promise<ConfiguracaoSala> {
    this.validateConfiguracaoSalaData(configuracaoData);

    // Verificar se já existe configuração para a mesma sala, ano e semestre
    const existingConfiguracao = await this.configuracaoSalaRepository.findBySalaAnoSemestre(
      configuracaoData.salaId,
      configuracaoData.ano,
      configuracaoData.semestre
    );

    if (existingConfiguracao) {
      throw new AppError(
        'Já existe configuração para esta sala neste período',
        HTTP_STATUS.CONFLICT
      );
    }

    return this.configuracaoSalaRepository.create(configuracaoData);
  }

  async updateConfiguracaoSala(
    id: number,
    configuracaoData: UpdateConfiguracaoSalaData
  ): Promise<ConfiguracaoSala> {
    await this.getConfiguracaoSalaById(id);

    // Se está atualizando sala, ano ou semestre, verificar conflitos
    if (configuracaoData.salaId || configuracaoData.ano || configuracaoData.semestre) {
      const currentConfig = await this.getConfiguracaoSalaById(id);
      const salaId = configuracaoData.salaId || currentConfig.salaId;
      const ano = configuracaoData.ano || currentConfig.ano;
      const semestre = configuracaoData.semestre || currentConfig.semestre;

      const existingConfiguracao = await this.configuracaoSalaRepository.findBySalaAnoSemestre(
        salaId,
        ano,
        semestre
      );

      if (existingConfiguracao && existingConfiguracao.id !== id) {
        throw new AppError(
          'Já existe configuração para esta sala neste período',
          HTTP_STATUS.CONFLICT
        );
      }
    }

    this.validateConfiguracaoSalaData(configuracaoData, true);
    const updatedConfiguracao = await this.configuracaoSalaRepository.update(id, configuracaoData);
    if (!updatedConfiguracao) {
      throw new AppError(
        'Erro ao atualizar configuração de sala',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
    return updatedConfiguracao;
  }

  async deleteConfiguracaoSala(id: number): Promise<void> {
    const configuracao = await this.getConfiguracaoSalaById(id);

    // Verificar se a configuração tem previsões associadas
    if (configuracao.previsoes && configuracao.previsoes.length > 0) {
      throw new AppError(
        'Não é possível deletar configuração com previsões associadas',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this.configuracaoSalaRepository.delete(id);
  }

  private validateConfiguracaoSalaData(
    configuracaoData: Partial<CreateConfiguracaoSalaData>,
    isUpdate = false
  ): void {
    if (!isUpdate) {
      if (!configuracaoData.salaId) {
        throw new AppError('ID da sala é obrigatório', HTTP_STATUS.BAD_REQUEST);
      }
      if (!configuracaoData.ano) {
        throw new AppError('Ano é obrigatório', HTTP_STATUS.BAD_REQUEST);
      }
      if (!configuracaoData.semestre) {
        throw new AppError('Semestre é obrigatório', HTTP_STATUS.BAD_REQUEST);
      }
      if (!configuracaoData.tamanho) {
        throw new AppError('Tamanho é obrigatório', HTTP_STATUS.BAD_REQUEST);
      }
      if (!configuracaoData.tipo) {
        throw new AppError('Tipo é obrigatório', HTTP_STATUS.BAD_REQUEST);
      }
    }

    if (configuracaoData.salaId !== undefined) {
      if (!Number.isInteger(configuracaoData.salaId) || configuracaoData.salaId <= 0) {
        throw new AppError(
          'ID da sala deve ser um número inteiro positivo',
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    if (configuracaoData.ano !== undefined) {
      if (
        !Number.isInteger(configuracaoData.ano) ||
        configuracaoData.ano < 2000 ||
        configuracaoData.ano > 2100
      ) {
        throw new AppError(
          'Ano deve ser um número inteiro entre 2000 e 2100',
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    if (configuracaoData.semestre !== undefined) {
      if (
        !Number.isInteger(configuracaoData.semestre) ||
        ![1, 2].includes(configuracaoData.semestre)
      ) {
        throw new AppError('Semestre deve ser 1 ou 2', HTTP_STATUS.BAD_REQUEST);
      }
    }

    if (configuracaoData.tamanho !== undefined) {
      if (!Object.values(TamanhoSalaEnum).includes(configuracaoData.tamanho)) {
        throw new AppError('Tamanho deve ser P, M ou G', HTTP_STATUS.BAD_REQUEST);
      }
    }

    if (configuracaoData.tipo !== undefined) {
      if (!Object.values(TipoSalaEnum).includes(configuracaoData.tipo)) {
        throw new AppError('Tipo deve ser lab ou aula', HTTP_STATUS.BAD_REQUEST);
      }
    }
  }
}
