import { Repository } from 'typeorm';
import AppDataSource from '../config/database';
import { PrevisaoAlocacao } from '../entities/PrevisaoAlocacao';

export class PrevisaoAlocacaoRepository {
  private repository: Repository<PrevisaoAlocacao>;

  constructor() {
    this.repository = AppDataSource.getRepository(PrevisaoAlocacao);
  }

  async findAll(): Promise<PrevisaoAlocacao[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: number): Promise<PrevisaoAlocacao | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<PrevisaoAlocacao>): Promise<PrevisaoAlocacao> {
    const previsao = this.repository.create(data);
    return this.repository.save(previsao);
  }
}
