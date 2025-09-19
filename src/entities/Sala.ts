import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ConfiguracaoSala } from './ConfiguracaoSala';

@Entity('salas')
export class Sala {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  numero: string;

  @Column({ length: 10 })
  bloco: string;

  @OneToMany(() => ConfiguracaoSala, (config) => config.sala)
  configuracoes: ConfiguracaoSala[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
