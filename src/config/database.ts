import 'dotenv/config';
import { DataSource } from 'typeorm';
import { ConfiguracaoSala, Curso, Previsao, Sala, Turma, User } from '../entities';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'alocacao_turmas',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Curso, Turma, Sala, ConfiguracaoSala, Previsao],
  migrations:
    process.env.NODE_ENV === 'development' ? ['src/migrations/*.ts'] : ['dist/migrations/*.js'],
  subscribers:
    process.env.NODE_ENV === 'development' ? ['src/subscribers/*.ts'] : ['dist/subscribers/*.js'],
});

export { AppDataSource };
export default AppDataSource;
