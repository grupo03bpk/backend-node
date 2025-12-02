import { PrevisaoAlocacao } from '../entities/PrevisaoAlocacao';
import { PrevisaoAlocacaoRepository } from '../repositories/PrevisaoAlocacaoRepository';
import { AppError } from '../middlewares';
import { HTTP_STATUS } from '../utils/constants';
import { ConfiguracaoPrevisaoRepository } from '../repositories/ConfiguracaoPrevisaoRepository';
import { ConfiguracaoSalaRepository } from '../repositories/ConfiguracaoSalaRepository';
import { TurmaRepository } from '../repositories/TurmaRepository';
import { TipoSalaEnum, TamanhoSalaEnum } from '../entities/ConfiguracaoSala';

export class PrevisaoAlocacaoService {
  private previsaoAlocacaoRepository: PrevisaoAlocacaoRepository;
  private configuracaoPrevisaoRepository: ConfiguracaoPrevisaoRepository;
  private configuracaoSalaRepository: ConfiguracaoSalaRepository;
  private turmaRepository: TurmaRepository;

  constructor() {
    this.previsaoAlocacaoRepository = new PrevisaoAlocacaoRepository();
    this.configuracaoPrevisaoRepository = new ConfiguracaoPrevisaoRepository();
    this.configuracaoSalaRepository = new ConfiguracaoSalaRepository();
    this.turmaRepository = new TurmaRepository();
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

    const alocacao: any[] = [];
    const salasDisponiveis = [...salas];
    const resumoAlocacao: any[] = salasDisponiveis.map(sala => ({ sala, turmasAlocadas: [] }));
    const turmasNaoAlocadas: any[] = [];
    const novasSalasNecessarias: Record<string, number> = { P: 0, M: 0, G: 0 };

    for (const turma of turmasProcessadas) {
      let salaAlocada = null;
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
        const resumo = resumoAlocacao.find(r => r.sala.id === salaAlocada.id);
        if (resumo) resumo.turmasAlocadas.push(turma);
      } else {
        alocacao.push({ turma, sala: null });
        turmasNaoAlocadas.push({ turma, motivo: `Sem sala disponível do tipo ${this.getTipoSalaNecessaria(turma, capacidadePorTamanho)}` });
        const tipoNecessario = this.getTipoSalaNecessaria(turma, capacidadePorTamanho);
        novasSalasNecessarias[tipoNecessario]++;
      }
    }

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

  getTipoSalaNecessaria(turma: any, capacidadePorTamanho: any): string {
    if (turma.alunosPrevistos <= capacidadePorTamanho.P) return 'P';
    if (turma.alunosPrevistos <= capacidadePorTamanho.M) return 'M';
    return 'G';
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
