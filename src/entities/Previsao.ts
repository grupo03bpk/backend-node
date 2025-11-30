import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Turma } from './Turma';
import { ConfiguracaoSala } from './ConfiguracaoSala';

@Entity('previsoes')
export class Previsao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  turmaId: number;

  @Column()
  configSalaId: number;

  @Column({ type: 'int' })
  ano: number;

  @Column({ type: 'int' })
  semestre: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxaOcupacao: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @ManyToOne(() => Turma, (turma) => turma.previsoes)
  @JoinColumn({ name: 'turmaId' })
  turma: Turma;

  @ManyToOne(() => ConfiguracaoSala, (config) => config.previsoes)
  @JoinColumn({ name: 'configSalaId' })
  configuracaoSala: ConfiguracaoSala;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  private getCapacidadeEstimada(): number {
    if (!this.configuracaoSala) return 0;
    
    const capacidadesPorTamanho = {
      'P': { lab: 20, aula: 30 },
      'M': { lab: 30, aula: 50 },
      'G': { lab: 40, aula: 80 }
    };

    const tipo = this.configuracaoSala.tipo as 'lab' | 'aula';
    return capacidadesPorTamanho[this.configuracaoSala.tamanho][tipo];
  }

  isAlocacaoViavel(): boolean {
    if (!this.configuracaoSala || !this.turma) {
      return false;
    }

    const capacidadeSala = this.getCapacidadeEstimada();
    const quantidadeAlunos = this.turma.quantidadeAlunos;

    return quantidadeAlunos <= capacidadeSala;
  }

  calcularTaxaOcupacao(): number {
    if (!this.configuracaoSala || !this.turma) {
      return 0;
    }

    const capacidadeSala = this.getCapacidadeEstimada();
    const quantidadeAlunos = this.turma.quantidadeAlunos;

    return Math.round((quantidadeAlunos / capacidadeSala) * 100 * 100) / 100;
  }
}
