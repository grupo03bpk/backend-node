import { Curso } from '../entities';
import { AppError } from '../middlewares';
import { CursoRepository } from '../repositories';
import { ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants';

export interface CursoCreateData {
  nome: string;
  duracao: number;
  evasao?: number;
}

export class CursoService {
  private cursoRepository: CursoRepository;

  constructor(cursoRepository?: CursoRepository) {
    this.cursoRepository = cursoRepository ?? new CursoRepository();
  }

  async findAll(): Promise<Curso[]> {
    return this.cursoRepository.findAll();
  }

  async findById(id: number): Promise<Curso> {
    const curso = await this.cursoRepository.findById(id);
    if (!curso) {
      throw new AppError(
        ERROR_MESSAGES.RESOURCE_NOT_FOUND || 'Curso não encontrado',
        HTTP_STATUS.NOT_FOUND
      );
    }
    return curso;
  }

  async create(data: CursoCreateData): Promise<Curso> {
    // Basic validation
    if (!data.nome || data.nome.trim().length === 0) {
      throw new AppError('Nome do curso é obrigatório', HTTP_STATUS.BAD_REQUEST);
    }
    if (!data.duracao || data.duracao <= 0) {
      throw new AppError('Duração do curso inválida', HTTP_STATUS.BAD_REQUEST);
    }

    const existing = await this.cursoRepository.findByNome(data.nome);
    if (existing) {
      throw new AppError('Curso com esse nome já existe', HTTP_STATUS.CONFLICT);
    }

    return this.cursoRepository.create({
      nome: data.nome,
      duracao: data.duracao,
      evasao: data.evasao ?? 0,
    });
  }

  async update(id: number, data: Partial<CursoCreateData>): Promise<Curso> {
    const curso = await this.findById(id);

    if (data.nome && data.nome !== curso.nome) {
      const other = await this.cursoRepository.findByNome(data.nome);
      if (other && other.id !== id) {
        throw new AppError('Outro curso com esse nome já existe', HTTP_STATUS.CONFLICT);
      }
    }

    const updated = await this.cursoRepository.update(id, data);
    if (!updated) {
      throw new AppError(
        ERROR_MESSAGES.RESOURCE_NOT_FOUND || 'Curso não encontrado',
        HTTP_STATUS.NOT_FOUND
      );
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.findById(id); // will throw if not found
    const deleted = await this.cursoRepository.delete(id);
    if (!deleted) {
      throw new AppError('Erro ao deletar curso', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async findWithPagination(page: number = 1, limit: number = 10) {
    return this.cursoRepository.findWithPagination(page, limit);
  }

  async findCursosComEstatisticas() {
    return this.cursoRepository.findCursosComEstatisticas();
  }
}
