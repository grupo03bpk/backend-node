import { TurmaRepository, CursoRepository } from '../repositories';
import { Turma, TurnoEnum } from '../entities';
import { AppError } from '../middlewares';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';

export interface CreateTurmaData {
  cursoId: number;
  turno: TurnoEnum;
  periodoAtual: number;
  quantidadeAlunos: number;
  ano: number;
}

export interface UpdateTurmaData {
  cursoId?: number;
  turno?: TurnoEnum;
  periodoAtual?: number;
  quantidadeAlunos?: number;
  ano?: number;
}

export class TurmaService {
  private turmaRepository: TurmaRepository;
  private cursoRepository: CursoRepository;

  constructor() {
    this.turmaRepository = new TurmaRepository();
    this.cursoRepository = new CursoRepository();
  }

  async getAllTurmas(): Promise<Turma[]> {
    return this.turmaRepository.findAll();
  }

  async getTurmaById(id: number): Promise<Turma> {
    const turma = await this.turmaRepository.findById(id);
    if (!turma) {
      throw new AppError(ERROR_MESSAGES.TURMA_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    return turma;
  }

  async createTurma(turmaData: CreateTurmaData): Promise<Turma> {
    await this.validateTurmaData(turmaData);

    return this.turmaRepository.create(turmaData);
  }

  async updateTurma(id: number, turmaData: UpdateTurmaData): Promise<Turma> {
    await this.getTurmaById(id);

    await this.validateTurmaData(turmaData, true);

    const updatedTurma = await this.turmaRepository.update(id, turmaData);
    if (!updatedTurma) {
      throw new AppError(ERROR_MESSAGES.TURMA_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return updatedTurma;
  }

  async deleteTurma(id: number): Promise<void> {
    await this.getTurmaById(id);
    
    const deleted = await this.turmaRepository.delete(id);
    if (!deleted) {
      throw new AppError('Erro ao deletar turma', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async getTurmasWithPagination(page: number = 1, limit: number = 10): Promise<{
    turmas: Turma[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const [turmas, total] = await this.turmaRepository.findWithPagination(page, limit);
    
    return {
      turmas,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  private async validateTurmaData(data: Partial<CreateTurmaData>, isUpdate: boolean = false): Promise<void> {
    if (!isUpdate || data.cursoId) {
        if (!data.cursoId) throw new AppError('cursoId é obrigatório', HTTP_STATUS.BAD_REQUEST);
        const curso = await this.cursoRepository.findById(data.cursoId);
        if (!curso) {
            throw new AppError(ERROR_MESSAGES.CURSO_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
    }

    if (!isUpdate || data.turno) {
        if (!data.turno || !Object.values(TurnoEnum).includes(data.turno)) {
            throw new AppError('Turno inválido', HTTP_STATUS.BAD_REQUEST);
        }
    }
    
    if (!isUpdate || data.periodoAtual) {
        if (data.periodoAtual === undefined || data.periodoAtual <= 0) {
            throw new AppError('Período atual deve ser um número positivo', HTTP_STATUS.BAD_REQUEST);
        }
    }

    if (!isUpdate || data.quantidadeAlunos) {
        if (data.quantidadeAlunos === undefined || data.quantidadeAlunos < 0) {
            throw new AppError('Quantidade de alunos não pode ser negativa', HTTP_STATUS.BAD_REQUEST);
        }
    }

    if (!isUpdate || data.ano) {
        if (data.ano === undefined || data.ano <= 1900) {
            throw new AppError('Ano inválido', HTTP_STATUS.BAD_REQUEST);
        }
    }
  }
}
