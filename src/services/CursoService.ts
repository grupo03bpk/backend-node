import { Curso } from '../entities';
import { AppError } from '../middlewares';
import { CursoRepository } from '../repositories';
import { HTTP_STATUS, VALIDATION_RULES } from '../utils/constants';

export interface CreateCursoData {
  nome: string;
  duracao: number;
  evasao?: number;
}

export class CursoService {
  // Métodos compatíveis com os testes automatizados
  async findAll() {
    return this.getAllCursos();
  }

  async findById(id: number) {
    return this.getCursoById(id);
  }

  async create(data: CreateCursoData) {
    return this.createCurso(data);
  }
  private cursoRepository: CursoRepository;

  constructor(cursoRepository?: CursoRepository) {
    this.cursoRepository = cursoRepository ?? new CursoRepository();
  }

  async getAllCursos(): Promise<Curso[]> {
    return this.cursoRepository.findAll();
  }

  async getCursoById(id: number): Promise<Curso> {
    const curso = await this.cursoRepository.findById(id);
    if (!curso) {
      throw new AppError('Curso não encontrado', HTTP_STATUS.NOT_FOUND);
    }
    return curso;
  }

  async createCurso(cursoData: CreateCursoData): Promise<Curso> {
    this.validateCursoData(cursoData);

    const existingCurso = await this.cursoRepository.findByNome(cursoData.nome);
    if (existingCurso) {
      throw new AppError('Curso com este nome já existe', HTTP_STATUS.CONFLICT);
    }

    return this.cursoRepository.create({
      nome: cursoData.nome,
      duracao: cursoData.duracao,
      evasao: cursoData.evasao ?? 0,
    });
  }

  async updateCurso(id: number, cursoData: Partial<CreateCursoData>): Promise<Curso> {
    await this.getCursoById(id);

    if (cursoData.nome) {
      const existingCurso = await this.cursoRepository.findByNome(cursoData.nome);
      if (existingCurso && existingCurso.id !== id) {
        throw new AppError('Curso com este nome já existe', HTTP_STATUS.CONFLICT);
      }
      this.validateNome(cursoData.nome);
    }

    if (cursoData.duracao) {
      this.validateDuracao(cursoData.duracao);
    }

    if (cursoData.evasao) {
      this.validateEvasao(cursoData.evasao);
    }

    const updatedCurso = await this.cursoRepository.update(id, cursoData);
    if (!updatedCurso) {
      throw new AppError('Curso não encontrado', HTTP_STATUS.NOT_FOUND);
    }

    return updatedCurso;
  }

  async deleteCurso(id: number): Promise<void> {
    await this.getCursoById(id);
    const deleted = await this.cursoRepository.delete(id);
    if (!deleted) {
      throw new AppError('Erro ao deletar curso', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async getCursosWithPagination(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    cursos: Curso[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const [cursos, total] = await this.cursoRepository.findWithPagination(page, limit);
    return {
      cursos,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async findCursosComEstatisticas() {
    return this.cursoRepository.findCursosComEstatisticas();
  }

  private validateCursoData(cursoData: CreateCursoData): void {
    this.validateNome(cursoData.nome);
    this.validateDuracao(cursoData.duracao);
    this.validateEvasao(cursoData.evasao);
  }

  private validateNome(nome: string): void {
    if (!nome || nome.trim().length < VALIDATION_RULES.NOME_MIN_LENGTH) {
      throw new AppError(
        `Nome deve ter pelo menos ${VALIDATION_RULES.NOME_MIN_LENGTH} caracteres`,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    if (nome.length > VALIDATION_RULES.NOME_MAX_LENGTH) {
      throw new AppError(
        `Nome deve ter no máximo ${VALIDATION_RULES.NOME_MAX_LENGTH} caracteres`,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }

  private validateDuracao(duracao: number | undefined): void {
    if (duracao === undefined || duracao <= 0) {
      throw new AppError('Duração deve ser um número positivo', HTTP_STATUS.BAD_REQUEST);
    }
  }

  private validateEvasao(evasao: number | undefined): void {
    if (evasao !== undefined && (evasao < 0 || evasao > 100)) {
      throw new AppError('Evasão deve ser um número entre 0 e 100', HTTP_STATUS.BAD_REQUEST);
    }
  }
}
