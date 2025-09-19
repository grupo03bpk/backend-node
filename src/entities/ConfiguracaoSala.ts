import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Previsao } from './Previsao';
import { Sala } from './Sala';

export enum TipoSalaEnum {
  P = 'P', // Pequena
  M = 'M', // Média
  G = 'G', // Grande
  LAB = 'LAB', // Laboratório
}

@Entity('configuracoes_sala')
export class ConfiguracaoSala {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  salaId: number;

  @Column({ type: 'int' })
  ano: number;

  @Column({ type: 'int' })
  semestre: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  area_m2: number;

  @Column({
    type: 'enum',
    enum: TipoSalaEnum,
  })
  tipo: TipoSalaEnum;

  @ManyToOne(() => Sala, (sala) => sala.configuracoes)
  @JoinColumn({ name: 'salaId' })
  sala: Sala;

  @OneToMany(() => Previsao, (previsao) => previsao.configuracaoSala)
  previsoes: Previsao[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Método para calcular capacidade baseado na área e tipo
  getCapacidade(): number {
    const multiplicadores = {
      [TipoSalaEnum.P]: 1.5, // 1.5 m² por aluno
      [TipoSalaEnum.M]: 1.2, // 1.2 m² por aluno
      [TipoSalaEnum.G]: 1.0, // 1.0 m² por aluno
      [TipoSalaEnum.LAB]: 2.0, // 2.0 m² por aluno (laboratórios precisam de mais espaço)
    };

    return Math.floor(this.area_m2 / multiplicadores[this.tipo]);
  }
}
