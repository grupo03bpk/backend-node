import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Turma } from './Turma';

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ type: 'int' })
  duracao: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  evasao: number;

  @OneToMany(() => Turma, (turma) => turma.curso, {
    cascade: true,
  })
  turmas: Turma[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
