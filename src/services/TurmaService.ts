import { Turma } from '../entities';
import { AppError } from '../middlewares';
import { TurmaRepository } from '../repositories';
import { ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants';

export interface TurmaCreateData {
  cursoId: number;
  turno: string;
  periodoAtual: number;
  quantidadeAlunos: number;
  ano: number;
}

export class TurmaService {
  private turmaRepository: TurmaRepository;

  constructor(turmaRepository?: TurmaRepository) {
    this.turmaRepository = turmaRepository ?? new TurmaRepository();
  }

  async findAll(): Promise<Turma[]> {
    return this.turmaRepository.findAll();
  }

  async findById(id: number): Promise<Turma> {
    const turma = await this.turmaRepository.findById(id);
    if (!turma) {
      throw new AppError(
        ERROR_MESSAGES.RESOURCE_NOT_FOUND || 'Turma não encontrada',
        HTTP_STATUS.NOT_FOUND
      );
    }
    return turma;
  }

  async create(data: TurmaCreateData): Promise<Turma> {
    // Basic validation
    if (!data.cursoId) throw new AppError('cursoId é obrigatório', HTTP_STATUS.BAD_REQUEST);
    if (!data.ano) throw new AppError('ano é obrigatório', HTTP_STATUS.BAD_REQUEST);

    return this.turmaRepository.create(data as Partial<Turma>);
  }

  async update(id: number, data: Partial<TurmaCreateData>): Promise<Turma> {
    const turma = await this.findById(id);
    const updated = await this.turmaRepository.update(id, data as Partial<Turma>);
    if (!updated)
      throw new AppError(
        ERROR_MESSAGES.RESOURCE_NOT_FOUND || 'Turma não encontrada',
        HTTP_STATUS.NOT_FOUND
      );
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    const deleted = await this.turmaRepository.delete(id);
    if (!deleted) throw new AppError('Erro ao deletar turma', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  async findWithPagination(page: number = 1, limit: number = 10) {
    return this.turmaRepository.findWithPagination(page, limit);
  }
}
