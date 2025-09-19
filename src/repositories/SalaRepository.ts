import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Sala } from '../entities';

export class SalaRepository {
  private repository: Repository<Sala>;

  constructor() {
    this.repository = AppDataSource.getRepository(Sala);
  }

  async findAll(): Promise<Sala[]> {
    return this.repository.find({
      relations: ['configuracoes'],
      order: {
        bloco: 'ASC',
        numero: 'ASC',
      },
    });
  }

  async findById(id: number): Promise<Sala | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['configuracoes'],
    });
  }

  async findByBloco(bloco: string): Promise<Sala[]> {
    return this.repository.find({
      where: { bloco },
      relations: ['configuracoes'],
      order: {
        numero: 'ASC',
      },
    });
  }

  async findByNumeroBloco(numero: string, bloco: string): Promise<Sala | null> {
    return this.repository.findOne({
      where: { numero, bloco },
      relations: ['configuracoes'],
    });
  }

  async create(salaData: Partial<Sala>): Promise<Sala> {
    const sala = this.repository.create(salaData);
    return this.repository.save(sala);
  }

  async update(id: number, salaData: Partial<Sala>): Promise<Sala | null> {
    await this.repository.update(id, salaData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async findWithPagination(page: number, limit: number): Promise<[Sala[], number]> {
    return this.repository.findAndCount({
      relations: ['configuracoes'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        bloco: 'ASC',
        numero: 'ASC',
      },
    });
  }

  async findSalasComConfiguracao(ano: number, semestre: number): Promise<Sala[]> {
    return this.repository
      .createQueryBuilder('sala')
      .leftJoinAndSelect('sala.configuracoes', 'config')
      .where('config.ano = :ano AND config.semestre = :semestre', { ano, semestre })
      .orderBy('sala.bloco', 'ASC')
      .addOrderBy('sala.numero', 'ASC')
      .getMany();
  }

  async getBlocosDisponiveis(): Promise<string[]> {
    const result = await this.repository
      .createQueryBuilder('sala')
      .select('DISTINCT sala.bloco', 'bloco')
      .orderBy('sala.bloco', 'ASC')
      .getRawMany();

    return result.map(item => item.bloco);
  }
}
