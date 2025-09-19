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
  taxaOcupacao: number; // percentual de ocupação da sala

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

  // Método para calcular se a sala comporta a turma
  isAlocacaoViavel(): boolean {
    if (!this.configuracaoSala || !this.turma) {
      return false;
    }

    const capacidadeSala = this.configuracaoSala.getCapacidade();
    const quantidadeAlunos = this.turma.quantidadeAlunos;

    return quantidadeAlunos <= capacidadeSala;
  }

  // Método para calcular a taxa de ocupação real
  calcularTaxaOcupacao(): number {
    if (!this.configuracaoSala || !this.turma) {
      return 0;
    }

    const capacidadeSala = this.configuracaoSala.getCapacidade();
    const quantidadeAlunos = this.turma.quantidadeAlunos;

    return Math.round((quantidadeAlunos / capacidadeSala) * 100 * 100) / 100; // 2 casas decimais
  }
}
