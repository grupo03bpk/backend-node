import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { ConfiguracaoSala, TipoSalaEnum } from '../entities';

export class ConfiguracaoSalaRepository {
  private repository: Repository<ConfiguracaoSala>;

  constructor() {
    this.repository = AppDataSource.getRepository(ConfiguracaoSala);
  }

  async findAll(): Promise<ConfiguracaoSala[]> {
    return this.repository.find({
      relations: ['sala', 'previsoes'],
      order: {
        ano: 'DESC',
        semestre: 'DESC',
      },
    });
  }

  async findById(id: number): Promise<ConfiguracaoSala | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['sala', 'previsoes'],
    });
  }

  async findBySala(salaId: number): Promise<ConfiguracaoSala[]> {
    return this.repository.find({
      where: { salaId },
      relations: ['sala'],
      order: {
        ano: 'DESC',
        semestre: 'DESC',
      },
    });
  }

  async findByAnoSemestre(ano: number, semestre: number): Promise<ConfiguracaoSala[]> {
    return this.repository.find({
      where: { ano, semestre },
      relations: ['sala'],
      order: {
        sala: {
          bloco: 'ASC',
          numero: 'ASC',
        },
      },
    });
  }

  async findBySalaAnoSemestre(
    salaId: number,
    ano: number,
    semestre: number
  ): Promise<ConfiguracaoSala | null> {
    return this.repository.findOne({
      where: { salaId, ano, semestre },
      relations: ['sala'],
    });
  }

  async create(configData: Partial<ConfiguracaoSala>): Promise<ConfiguracaoSala> {
    const config = this.repository.create(configData);
    return this.repository.save(config);
  }

  async update(id: number, configData: Partial<ConfiguracaoSala>): Promise<ConfiguracaoSala | null> {
    await this.repository.update(id, configData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async findWithPagination(page: number, limit: number): Promise<[ConfiguracaoSala[], number]> {
    return this.repository.findAndCount({
      relations: ['sala'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        ano: 'DESC',
        semestre: 'DESC',
      },
    });
  }

  async findByTipo(tipo: TipoSalaEnum, ano: number, semestre: number): Promise<ConfiguracaoSala[]> {
    return this.repository.find({
      where: { tipo, ano, semestre },
      relations: ['sala'],
      order: {
        area_m2: 'DESC',
      },
    });
  }

  async getEstatisticasPorTipo(ano: number, semestre: number): Promise<any[]> {
    return this.repository
      .createQueryBuilder('config')
      .select([
        'config.tipo as tipo',
        'COUNT(config.id) as quantidade',
        'AVG(config.area_m2) as areaMedia',
        'SUM(config.area_m2) as areaTotal',
      ])
      .where('config.ano = :ano AND config.semestre = :semestre', { ano, semestre })
      .groupBy('config.tipo')
      .getRawMany();
  }

  async findConfiguracoesVigentes(): Promise<ConfiguracaoSala[]> {
    // Busca as configurações mais recentes para cada sala
    const subQuery = this.repository
      .createQueryBuilder('sub')
      .select('MAX(sub.ano * 10 + sub.semestre)', 'maxPeriodo')
      .addSelect('sub.salaId')
      .groupBy('sub.salaId');

    return this.repository
      .createQueryBuilder('config')
      .innerJoin(
        `(${subQuery.getQuery()})`,
        'latest',
        'latest.salaId = config.salaId AND latest.maxPeriodo = config.ano * 10 + config.semestre'
      )
      .leftJoinAndSelect('config.sala', 'sala')
      .setParameters(subQuery.getParameters())
      .getMany();
  }
}
