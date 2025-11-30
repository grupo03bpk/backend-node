import { Repository } from 'typeorm';
import AppDataSource from '../config/database';
import { ConfiguracaoPrevisao } from '../entities';

export class ConfiguracaoPrevisaoRepository {
  private repository: Repository<ConfiguracaoPrevisao>;

  constructor() {
    this.repository = AppDataSource.getRepository(ConfiguracaoPrevisao);
  }

  async findAll(): Promise<ConfiguracaoPrevisao[]> {
    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findById(id: number): Promise<ConfiguracaoPrevisao | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async create(configData: Partial<ConfiguracaoPrevisao>): Promise<ConfiguracaoPrevisao> {
    const config = this.repository.create(configData);
    return this.repository.save(config);
  }

  async update(id: number, configData: Partial<ConfiguracaoPrevisao>): Promise<ConfiguracaoPrevisao | null> {
    await this.repository.update(id, configData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async findWithPagination(page: number, limit: number): Promise<[ConfiguracaoPrevisao[], number]> {
    return this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });
  }
}