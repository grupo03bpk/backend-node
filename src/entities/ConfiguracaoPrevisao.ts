import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('configuracoes_previsao')
export class ConfiguracaoPrevisao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: 'Capacidade de alunos para sala pequena (P)' })
  capacidadeSalaP: number;

  @Column({ type: 'int', comment: 'Capacidade de alunos para sala média (M)' })
  capacidadeSalaM: number;

  @Column({ type: 'int', comment: 'Capacidade de alunos para sala grande (G)' })
  capacidadeSalaG: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: 'Área em metros quadrados por aluno' })
  areaPorAlunoM2: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: 'Taxa de evasão em porcentagem' })
  taxaEvasaoPercentual: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}