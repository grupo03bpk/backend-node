import { PrevisaoAlocacao } from '../entities/PrevisaoAlocacao';
import { PrevisaoAlocacaoRepository } from '../repositories/PrevisaoAlocacaoRepository';
import { AppError } from '../middlewares';
import { HTTP_STATUS } from '../utils/constants';
import { ConfiguracaoPrevisaoRepository } from '../repositories/ConfiguracaoPrevisaoRepository';
import { ConfiguracaoSalaRepository } from '../repositories/ConfiguracaoSalaRepository';
import { TurmaRepository } from '../repositories/TurmaRepository';
import { TipoSalaEnum, TamanhoSalaEnum } from '../entities/ConfiguracaoSala';


export interface TurmaProcessada {
  [key: string]: any;
  alunosPrevistos: number;
  vaiFormar: boolean;
}
export interface SalaConfig {
  [key: string]: any;
  tamanho: string;
  id: number;
  numero?: string;
}
export interface AlocacaoResult {
  alocacao: Array<{ turma: TurmaProcessada; sala: SalaConfig | null }>;
  turmasNaoAlocadas: Array<{ turma: TurmaProcessada; motivo: string }>;
  novasSalasNecessarias: Record<string, number>;
  resumoAlocacao: Array<{ sala: SalaConfig; turmasAlocadas: TurmaProcessada[] }>;
}
export interface AlocacaoStrategy {
  alocarTurmas(
    turmas: TurmaProcessada[],
    salas: SalaConfig[],
    capacidadePorTamanho: Record<string, number>,
    areaPorAluno: number
  ): AlocacaoResult;
}

export class AlocacaoPadraoStrategy implements AlocacaoStrategy {
  alocarTurmas(
    turmas: TurmaProcessada[],
    salas: SalaConfig[],
    capacidadePorTamanho: Record<string, number>,
    areaPorAluno: number
  ): AlocacaoResult {
    const alocacao: Array<{ turma: TurmaProcessada; sala: SalaConfig | null }> = [];
    const salasDisponiveis = [...salas];
    const resumoAlocacao: Array<{ sala: SalaConfig; turmasAlocadas: TurmaProcessada[] }> = salasDisponiveis.map(sala => ({ sala, turmasAlocadas: [] }));
    const turmasNaoAlocadas: Array<{ turma: TurmaProcessada; motivo: string }> = [];
    const novasSalasNecessarias: Record<string, number> = { P: 0, M: 0, G: 0 };

    for (const turma of turmas) {
      let salaAlocada: SalaConfig | null = null;
      for (const salaConfig of salasDisponiveis) {
        const capacidade = capacidadePorTamanho[salaConfig.tamanho];
        const areaTotal = capacidade * areaPorAluno;
        if (
          turma.alunosPrevistos <= capacidade &&
          turma.alunosPrevistos * areaPorAluno <= areaTotal
        ) {
          salaAlocada = salaConfig;
          break;
        }
      }
      if (salaAlocada) {
        alocacao.push({ turma, sala: salaAlocada });
        salasDisponiveis.splice(salasDisponiveis.indexOf(salaAlocada), 1);
        const resumo = resumoAlocacao.find(r => r.sala.id === salaAlocada!.id);
        if (resumo) resumo.turmasAlocadas.push(turma);
      } else {
        alocacao.push({ turma, sala: null });
        turmasNaoAlocadas.push({ turma, motivo: `Sem sala disponível do tipo ${this.getTipoSalaNecessaria(turma, capacidadePorTamanho)}` });
        const tipoNecessario = this.getTipoSalaNecessaria(turma, capacidadePorTamanho);
        novasSalasNecessarias[tipoNecessario]++;
      }
    }
    return { alocacao, turmasNaoAlocadas, novasSalasNecessarias, resumoAlocacao };
  }
  getTipoSalaNecessaria(turma: TurmaProcessada, capacidadePorTamanho: Record<string, number>): string {
    if (turma.alunosPrevistos <= capacidadePorTamanho.P) return 'P';
    if (turma.alunosPrevistos <= capacidadePorTamanho.M) return 'M';
    return 'G';
  }
}

export class PrevisaoExportAdapter {
  static toExcelFormat(previsao: { alocacao: Array<{ turma: TurmaProcessada; sala: SalaConfig | null }> }): Array<{ Turma: string | number; Sala: string; Alunos: number }> {
    // Adapta o objeto para formato de planilha
    return previsao.alocacao.map((item: { turma: TurmaProcessada; sala: SalaConfig | null }) => ({
      Turma: item.turma.nome || item.turma.id,
      Sala: item.sala ? item.sala.numero || String(item.sala.id) : 'Não alocada',
      Alunos: item.turma.alunosPrevistos
    }));
  }
}

export class RepositoryFactory {
  static createPrevisaoAlocacaoRepository() {
    return new PrevisaoAlocacaoRepository();
  }
  static createConfiguracaoPrevisaoRepository() {
    return new ConfiguracaoPrevisaoRepository();
  }
  static createConfiguracaoSalaRepository() {
    return new ConfiguracaoSalaRepository();
  }
  static createTurmaRepository() {
    return new TurmaRepository();
  }
}

export class PrevisaoAlocacaoService {
  private previsaoAlocacaoRepository: PrevisaoAlocacaoRepository;
  private configuracaoPrevisaoRepository: ConfiguracaoPrevisaoRepository;
  private configuracaoSalaRepository: ConfiguracaoSalaRepository;
  private turmaRepository: TurmaRepository;
  private alocacaoStrategy: AlocacaoStrategy;

  constructor(alocacaoStrategy?: AlocacaoStrategy) {
    this.previsaoAlocacaoRepository = RepositoryFactory.createPrevisaoAlocacaoRepository();
    this.configuracaoPrevisaoRepository = RepositoryFactory.createConfiguracaoPrevisaoRepository();
    this.configuracaoSalaRepository = RepositoryFactory.createConfiguracaoSalaRepository();
    this.turmaRepository = RepositoryFactory.createTurmaRepository();
    this.alocacaoStrategy = alocacaoStrategy || new AlocacaoPadraoStrategy();
  }

  async gerarPrevisao(dadosEntrada: any): Promise<any> {
    const configPrevisao = (await this.configuracaoPrevisaoRepository.findAll())[0];
    if (!configPrevisao) return { erro: 'Configuração de previsão não encontrada' };

    const { turmas, ano, semestre } = dadosEntrada;
    const salas = await this.configuracaoSalaRepository.findByTipo(TipoSalaEnum.AULA, ano, semestre);

    const capacidadePorTamanho = {
      P: configPrevisao.capacidadeSalaP,
      M: configPrevisao.capacidadeSalaM,
      G: configPrevisao.capacidadeSalaG,
    };

    const areaPorAluno = configPrevisao.areaPorAlunoM2;
    const taxaEvasao = configPrevisao.taxaEvasaoPercentual;

    let turmasProcessadas = turmas.map((turma: any) => {
      let alunosPrevistos = Math.round(turma.quantidadeAlunos * (1 - taxaEvasao / 100));
      return {
        ...turma,
        alunosPrevistos,
        vaiFormar: turma.periodoAtual === turma.curso.duracao,
      };
    });

    turmasProcessadas = turmasProcessadas.filter((t: any) => !t.vaiFormar);
    turmasProcessadas.sort((a: any, b: any) => b.alunosPrevistos - a.alunosPrevistos);

    const { alocacao, turmasNaoAlocadas, novasSalasNecessarias, resumoAlocacao } = this.alocacaoStrategy.alocarTurmas(
      turmasProcessadas,
      salas,
      capacidadePorTamanho,
      areaPorAluno
    );

    const novasSalasNecessariasArr = Object.entries(novasSalasNecessarias)
      .filter(([_, qtd]) => qtd > 0)
      .map(([tipo, quantidade]) => ({ tipo, quantidade }));

    return {
      ano,
      semestre,
      alocacao,
      turmasNaoAlocadas,
      novasSalasNecessarias: novasSalasNecessariasArr,
      resumoAlocacao,
      configPrevisao,
    };
  }

  exportPrevisaoExcel(previsao: any) {
    return PrevisaoExportAdapter.toExcelFormat(previsao);
  }

  async salvarPrevisao(nome: string, dados: any): Promise<PrevisaoAlocacao> {
    return this.previsaoAlocacaoRepository.create({ nome, dados });
  }

  async listarPrevisoes(): Promise<PrevisaoAlocacao[]> {
    return this.previsaoAlocacaoRepository.findAll();
  }

  async buscarPrevisaoPorId(id: number): Promise<PrevisaoAlocacao> {
    const previsao = await this.previsaoAlocacaoRepository.findById(id);
    if (!previsao) {
      throw new AppError('Previsão não encontrada', HTTP_STATUS.NOT_FOUND);
    }
    return previsao;
  }
}
