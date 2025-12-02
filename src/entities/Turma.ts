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
import { Curso } from './Curso';
import { Previsao } from './Previsao';
import { Sala } from './Sala';

export enum TurnoEnum {
  MANHA = 'manha',
  TARDE = 'tarde',
  NOITE = 'noite',
}

@Entity('turmas')
export class Turma {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cursoId: number;

  @Column({
    type: 'enum',
    enum: TurnoEnum,
  })
  turno: TurnoEnum;

  @Column({ type: 'int' })
  periodoAtual: number;

  @Column({ type: 'int' })
  quantidadeAlunos: number;

  @Column({ type: 'int' })
  ano: number;

  @ManyToOne(() => Curso, (curso) => curso.turmas)
  @JoinColumn({ name: 'cursoId' })
  curso: Curso;

  @ManyToOne(() => Sala, { nullable: true, eager: false })
  @JoinColumn({ name: 'salaId' })
  sala: Sala;

  @Column({ nullable: true })
  salaId?: number;

  @OneToMany(() => Previsao, (previsao) => previsao.turma)
  previsoes: Previsao[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
