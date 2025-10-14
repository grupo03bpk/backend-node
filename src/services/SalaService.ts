import { Sala } from '../entities';
import { AppError } from '../middlewares';
import { SalaRepository } from '../repositories';
import { HTTP_STATUS } from '../utils/constants';

export interface CreateSalaData {
  numero: string;
  bloco: string;
}

export interface UpdateSalaData {
  numero?: string;
  bloco?: string;
}

export class SalaService {
  private salaRepository: SalaRepository;

  constructor(salaRepository?: SalaRepository) {
    this.salaRepository = salaRepository ?? new SalaRepository();
  }

  // Métodos compatíveis com os testes automatizados
  async findAll() {
    return this.getAllSalas();
  }

  async findById(id: number) {
    return this.getSalaById(id);
  }

  async create(data: CreateSalaData) {
    return this.createSala(data);
  }

  async getAllSalas(): Promise<Sala[]> {
    return this.salaRepository.findAll();
  }

  async getSalasWithPagination(page: number, limit: number) {
    const [salas, total] = await this.salaRepository.findWithPagination(page, limit);
    return {
      salas,
      total,
      currentPage: page,
    };
  }

  async getSalaById(id: number): Promise<Sala> {
    const sala = await this.salaRepository.findById(id);
    if (!sala) {
      throw new AppError('Sala não encontrada', HTTP_STATUS.NOT_FOUND);
    }
    return sala;
  }

  async createSala(salaData: CreateSalaData): Promise<Sala> {
    this.validateSalaData(salaData);

    const existingSala = await this.salaRepository.findByNumeroBloco(
      salaData.numero,
      salaData.bloco
    );
    if (existingSala) {
      throw new AppError('Sala com este número e bloco já existe', HTTP_STATUS.CONFLICT);
    }

    return this.salaRepository.create(salaData);
  }

  async updateSala(id: number, salaData: UpdateSalaData): Promise<Sala> {
    await this.getSalaById(id);

    if (salaData.numero && salaData.bloco) {
      const existingSala = await this.salaRepository.findByNumeroBloco(
        salaData.numero,
        salaData.bloco
      );
      if (existingSala && existingSala.id !== id) {
        throw new AppError('Sala com este número e bloco já existe', HTTP_STATUS.CONFLICT);
      }
    }

    this.validateSalaData(salaData, true);
    const updatedSala = await this.salaRepository.update(id, salaData);
    if (!updatedSala) {
      throw new AppError('Erro ao atualizar sala', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
    return updatedSala;
  }

  async deleteSala(id: number): Promise<void> {
    const sala = await this.getSalaById(id);

    // Verificar se a sala tem configurações associadas
    if (sala.configuracoes && sala.configuracoes.length > 0) {
      throw new AppError(
        'Não é possível deletar sala com configurações associadas',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this.salaRepository.delete(id);
  }

  private validateSalaData(salaData: Partial<CreateSalaData>, isUpdate = false): void {
    if (!isUpdate) {
      if (!salaData.numero) {
        throw new AppError('Número da sala é obrigatório', HTTP_STATUS.BAD_REQUEST);
      }
      if (!salaData.bloco) {
        throw new AppError('Bloco é obrigatório', HTTP_STATUS.BAD_REQUEST);
      }
    }

    if (salaData.numero) {
      if (typeof salaData.numero !== 'string' || salaData.numero.trim().length === 0) {
        throw new AppError('Número da sala deve ser uma string válida', HTTP_STATUS.BAD_REQUEST);
      }
      if (salaData.numero.length > 20) {
        throw new AppError(
          'Número da sala deve ter no máximo 20 caracteres',
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    if (salaData.bloco) {
      if (typeof salaData.bloco !== 'string' || salaData.bloco.trim().length === 0) {
        throw new AppError('Bloco deve ser uma string válida', HTTP_STATUS.BAD_REQUEST);
      }
      if (salaData.bloco.length > 10) {
        throw new AppError('Bloco deve ter no máximo 10 caracteres', HTTP_STATUS.BAD_REQUEST);
      }
    }
  }
}
