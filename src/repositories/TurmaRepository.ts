import { Repository } from 'typeorm';
import  AppDataSource  from '../config/database';
import { Turma, TurnoEnum } from '../entities';

export class TurmaRepository {
  private repository: Repository<Turma>;

  constructor() {
    this.repository = AppDataSource.getRepository(Turma);
  }

  async findAll(): Promise<Turma[]> {
    return this.repository.find({
      relations: ['curso', 'previsoes'],
      order: {
        ano: 'DESC',
        turno: 'ASC',
      },
    });
  }

  async findById(id: number): Promise<Turma | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['curso', 'previsoes'],
    });
  }

  async findByCurso(cursoId: number): Promise<Turma[]> {
    return this.repository.find({
      where: { cursoId },
      relations: ['curso'],
      order: {
        ano: 'DESC',
        turno: 'ASC',
      },
    });
  }

  async findByAnoSemestre(ano: number, semestre?: number): Promise<Turma[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('turma')
      .leftJoinAndSelect('turma.curso', 'curso')
      .where('turma.ano = :ano', { ano });

    if (semestre) {
      // Para futuro uso se precisar filtrar por semestre
      queryBuilder.andWhere('turma.periodoAtual = :semestre', { semestre });
    }

    return queryBuilder
      .orderBy('turma.turno', 'ASC')
      .addOrderBy('curso.nome', 'ASC')
      .getMany();
  }

  async create(turmaData: Partial<Turma>): Promise<Turma> {
    const turma = this.repository.create(turmaData);
    return this.repository.save(turma);
  }

  async update(id: number, turmaData: Partial<Turma>): Promise<Turma | null> {
    await this.repository.update(id, turmaData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async findWithPagination(page: number, limit: number): Promise<[Turma[], number]> {
    return this.repository.findAndCount({
      relations: ['curso'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        ano: 'DESC',
        turno: 'ASC',
      },
    });
  }

  async findByTurno(turno: TurnoEnum): Promise<Turma[]> {
    return this.repository.find({
      where: { turno },
      relations: ['curso'],
      order: {
        ano: 'DESC',
      },
    });
  }

  async getTurmasComOcupacao(ano: number): Promise<any[]> {
    return this.repository
      .createQueryBuilder('turma')
      .leftJoinAndSelect('turma.curso', 'curso')
      .leftJoinAndSelect('turma.previsoes', 'previsao')
      .leftJoinAndSelect('previsao.configuracaoSala', 'config')
      .leftJoinAndSelect('config.sala', 'sala')
      .where('turma.ano = :ano', { ano })
      .getMany();
  }
}
