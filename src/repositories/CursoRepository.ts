import { Repository } from 'typeorm';
import  AppDataSource  from '../config/database';
import { Curso } from '../entities';

export class CursoRepository {
  private repository: Repository<Curso>;

  constructor() {
    this.repository = AppDataSource.getRepository(Curso);
  }

  async findAll(): Promise<Curso[]> {
    return this.repository.find({
      relations: ['turmas'],
      order: {
        nome: 'ASC',
      },
    });
  }

  async findById(id: number): Promise<Curso | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['turmas'],
    });
  }

  async findByNome(nome: string): Promise<Curso | null> {
    return this.repository.findOne({
      where: { nome },
    });
  }

  async create(cursoData: Partial<Curso>): Promise<Curso> {
    const curso = this.repository.create(cursoData);
    return this.repository.save(curso);
  }

  async update(id: number, cursoData: Partial<Curso>): Promise<Curso | null> {
    await this.repository.update(id, cursoData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async findWithPagination(page: number, limit: number): Promise<[Curso[], number]> {
    return this.repository.findAndCount({
      relations: ['turmas'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        nome: 'ASC',
      },
    });
  }

  async findCursosComEstatisticas(): Promise<any[]> {
    return this.repository
      .createQueryBuilder('curso')
      .leftJoinAndSelect('curso.turmas', 'turma')
      .select([
        'curso.id',
        'curso.nome',
        'curso.duracao',
        'curso.evasao',
        'COUNT(turma.id) as totalTurmas',
        'SUM(turma.quantidadeAlunos) as totalAlunos',
      ])
      .groupBy('curso.id')
      .getRawMany();
  }
}
