import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { authConfig } from '../config/auth';

export enum UserPerfil {
  ADMIN = 'admin',
  COORDENADOR = 'coordenador',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column()
  senha: string;

  @Column({
    type: 'enum',
    enum: UserPerfil,
    default: UserPerfil.COORDENADOR,
  })
  perfil: UserPerfil;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.senha) {
      this.senha = await bcrypt.hash(this.senha, authConfig.bcrypt.saltRounds);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.senha);
  }
}
