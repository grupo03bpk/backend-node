import { Repository } from 'typeorm';
import  AppDataSource  from '../config/database';
import { Previsao } from '../entities';

export class PrevisaoRepository {
  private repository: Repository<Previsao>;

  constructor() {
    this.repository = AppDataSource.getRepository(Previsao);
  }

  async findAll(): Promise<Previsao[]> {
    return this.repository.find({
      relations: ['turma', 'turma.curso', 'configuracaoSala', 'configuracaoSala.sala'],
      order: {
        ano: 'DESC',
        semestre: 'DESC',
      },
    });
  }

  async findById(id: number): Promise<Previsao | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['turma', 'turma.curso', 'configuracaoSala', 'configuracaoSala.sala'],
    });
  }

  async findByTurma(turmaId: number): Promise<Previsao[]> {
    return this.repository.find({
      where: { turmaId },
      relations: ['configuracaoSala', 'configuracaoSala.sala'],
      order: {
        ano: 'DESC',
        semestre: 'DESC',
      },
    });
  }

  async findByConfigSala(configSalaId: number): Promise<Previsao[]> {
    return this.repository.find({
      where: { configSalaId },
      relations: ['turma', 'turma.curso'],
      order: {
        ano: 'DESC',
        semestre: 'DESC',
      },
    });
  }

  async findByAnoSemestre(ano: number, semestre: number): Promise<Previsao[]> {
    return this.repository.find({
      where: { ano, semestre },
      relations: ['turma', 'turma.curso', 'configuracaoSala', 'configuracaoSala.sala'],
      order: {
        turma: {
          turno: 'ASC',
        },
        configuracaoSala: {
          sala: {
            bloco: 'ASC',
            numero: 'ASC',
          },
        },
      },
    });
  }

  async create(previsaoData: Partial<Previsao>): Promise<Previsao> {
    const previsao = this.repository.create(previsaoData);
    return this.repository.save(previsao);
  }

  async update(id: number, previsaoData: Partial<Previsao>): Promise<Previsao | null> {
    await this.repository.update(id, previsaoData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async findWithPagination(page: number, limit: number): Promise<[Previsao[], number]> {
    return this.repository.findAndCount({
      relations: ['turma', 'turma.curso', 'configuracaoSala', 'configuracaoSala.sala'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        ano: 'DESC',
        semestre: 'DESC',
      },
    });
  }

  async getRelatorioOcupacao(ano: number, semestre: number): Promise<any[]> {
    return this.repository
      .createQueryBuilder('previsao')
      .leftJoinAndSelect('previsao.turma', 'turma')
      .leftJoinAndSelect('turma.curso', 'curso')
      .leftJoinAndSelect('previsao.configuracaoSala', 'config')
      .leftJoinAndSelect('config.sala', 'sala')
      .select([
        'sala.bloco as bloco',
        'sala.numero as numero',
        'config.tipo as tipoSala',
        'config.area_m2 as area',
        'curso.nome as curso',
        'turma.turno as turno',
        'turma.quantidadeAlunos as alunos',
        'previsao.taxaOcupacao as ocupacao',
      ])
      .where('previsao.ano = :ano AND previsao.semestre = :semestre', { ano, semestre })
      .orderBy('sala.bloco', 'ASC')
      .addOrderBy('sala.numero', 'ASC')
      .getRawMany();
  }

  async getTaxaUsoSalas(ano: number, semestre: number): Promise<any[]> {
    return this.repository
      .createQueryBuilder('previsao')
      .leftJoin('previsao.configuracaoSala', 'config')
      .leftJoin('config.sala', 'sala')
      .select([
        'sala.bloco as bloco',
        'sala.numero as numero',
        'config.tipo as tipo',
        'AVG(previsao.taxaOcupacao) as taxaMedia',
        'COUNT(previsao.id) as totalUsos',
      ])
      .where('previsao.ano = :ano AND previsao.semestre = :semestre', { ano, semestre })
      .groupBy('sala.id, config.id')
      .orderBy('taxaMedia', 'DESC')
      .getRawMany();
  }

  async getComparativoAnos(anoInicial: number, anoFinal: number, semestre: number): Promise<any[]> {
    return this.repository
      .createQueryBuilder('previsao')
      .leftJoin('previsao.turma', 'turma')
      .leftJoin('turma.curso', 'curso')
      .select([
        'previsao.ano as ano',
        'curso.nome as curso',
        'COUNT(previsao.id) as totalAlocacoes',
        'AVG(previsao.taxaOcupacao) as ocupacaoMedia',
        'SUM(turma.quantidadeAlunos) as totalAlunos',
      ])
      .where('previsao.ano BETWEEN :anoInicial AND :anoFinal', { anoInicial, anoFinal })
      .andWhere('previsao.semestre = :semestre', { semestre })
      .groupBy('previsao.ano, curso.id')
      .orderBy('previsao.ano', 'ASC')
      .addOrderBy('curso.nome', 'ASC')
      .getRawMany();
  }

  async findConflitos(ano: number, semestre: number): Promise<any[]> {
    // Busca salas que têm mais de uma turma alocada no mesmo período
    return this.repository
      .createQueryBuilder('p1')
      .leftJoin('previsao', 'p2', 'p1.configSalaId = p2.configSalaId AND p1.id != p2.id')
      .leftJoin('p1.turma', 't1')
      .leftJoin('p2.turma', 't2')
      .leftJoin('p1.configuracaoSala', 'config')
      .leftJoin('config.sala', 'sala')
      .select([
        'sala.bloco',
        'sala.numero',
        't1.turno as turno1',
        't2.turno as turno2',
        't1.id as turma1',
        't2.id as turma2',
      ])
      .where('p1.ano = :ano AND p1.semestre = :semestre', { ano, semestre })
      .andWhere('p2.ano = :ano AND p2.semestre = :semestre', { ano, semestre })
      .andWhere('t1.turno = t2.turno') // Mesmo turno = conflito
      .getRawMany();
  }
}
