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

export enum TamanhoSalaEnum {
  P = 'P',
  M = 'M',
  G = 'G',
}

export enum TipoSalaEnum {
  LAB = 'lab',
  AULA = 'aula',
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

  @Column({
    type: 'enum',
    enum: TamanhoSalaEnum,
  })
  tamanho: TamanhoSalaEnum;

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
}
