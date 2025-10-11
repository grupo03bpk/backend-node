import AppDataSource from '../config/database';
import { User, UserPerfil, Curso, TurnoEnum, TipoSalaEnum, TamanhoSalaEnum } from '../entities';
import { UserRepository, CursoRepository, SalaRepository, TurmaRepository, ConfiguracaoSalaRepository } from '../repositories';

async function seed() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    await AppDataSource.initialize();
    console.log('✅ Conectado ao banco de dados');

    const userRepo = new UserRepository();
    const cursoRepo = new CursoRepository();
    const salaRepo = new SalaRepository();
    const turmaRepo = new TurmaRepository();
    const configRepo = new ConfiguracaoSalaRepository();

    console.log('👤 Criando usuário administrador...');
    const admin = await userRepo.create({
      nome: 'Administrador',
      username: 'admin',
      senha: 'admin123',
      perfil: UserPerfil.ADMIN,
    });
    console.log('✅ Usuário administrador criado');

    console.log('👤 Criando usuário coordenador...');
    const coordenador = await userRepo.create({
      nome: 'João Coordenador',
      username: 'coordenador',
      senha: 'coord123',
      perfil: UserPerfil.COORDENADOR,
    });
    console.log('✅ Usuário coordenador criado');

    console.log('📚 Criando cursos...');
    const cursos = [
      {
        nome: 'Ciência da Computação',
        duracao: 8,
        evasao: 15.5,
      },
      {
        nome: 'Engenharia de Software',
        duracao: 8,
        evasao: 12.3,
      },
      {
        nome: 'Sistemas de Informação',
        duracao: 8,
        evasao: 18.7,
      },
      {
        nome: 'Análise e Desenvolvimento de Sistemas',
        duracao: 6,
        evasao: 20.1,
      },
    ];

    const cursosCreated = [];
    for (const cursoData of cursos) {
      const curso = await cursoRepo.create(cursoData);
      cursosCreated.push(curso);
    }
    console.log('✅ Cursos criados');

    console.log('🏢 Criando salas...');
    const salasData = [
      { numero: '101', bloco: 'A' },
      { numero: '102', bloco: 'A' },
      { numero: '103', bloco: 'A' },
      { numero: '201', bloco: 'A' },
      { numero: '202', bloco: 'A' },
      { numero: '101', bloco: 'B' },
      { numero: '102', bloco: 'B' },
      { numero: '103', bloco: 'B' },
      { numero: 'LAB1', bloco: 'C' },
      { numero: 'LAB2', bloco: 'C' },
    ];

    const salasCreated = [];
    for (const salaData of salasData) {
      const sala = await salaRepo.create(salaData);
      salasCreated.push(sala);
    }
    console.log('✅ Salas criadas');

    console.log('⚙️ Criando configurações de sala...');
    const configuracoes = [
      { salaId: salasCreated[0].id, ano: 2024, semestre: 1, tamanho: TamanhoSalaEnum.M, tipo: TipoSalaEnum.AULA },
      { salaId: salasCreated[1].id, ano: 2024, semestre: 1, tamanho: TamanhoSalaEnum.P, tipo: TipoSalaEnum.AULA },
      { salaId: salasCreated[2].id, ano: 2024, semestre: 1, tamanho: TamanhoSalaEnum.G, tipo: TipoSalaEnum.AULA },
      { salaId: salasCreated[3].id, ano: 2024, semestre: 1, tamanho: TamanhoSalaEnum.M, tipo: TipoSalaEnum.AULA },
      { salaId: salasCreated[4].id, ano: 2024, semestre: 1, tamanho: TamanhoSalaEnum.G, tipo: TipoSalaEnum.AULA },
      { salaId: salasCreated[5].id, ano: 2024, semestre: 1, tamanho: TamanhoSalaEnum.M, tipo: TipoSalaEnum.AULA },
      { salaId: salasCreated[6].id, ano: 2024, semestre: 1, tamanho: TamanhoSalaEnum.P, tipo: TipoSalaEnum.AULA },
      { salaId: salasCreated[7].id, ano: 2024, semestre: 1, tamanho: TamanhoSalaEnum.G, tipo: TipoSalaEnum.AULA },
      { salaId: salasCreated[8].id, ano: 2024, semestre: 1, tamanho: TamanhoSalaEnum.G, tipo: TipoSalaEnum.LAB },
      { salaId: salasCreated[9].id, ano: 2024, semestre: 1, tamanho: TamanhoSalaEnum.G, tipo: TipoSalaEnum.LAB },
    ];

    for (const configData of configuracoes) {
      await configRepo.create(configData);
    }
    console.log('✅ Configurações de sala criadas');

    console.log('🎓 Criando turmas...');
    const turmasData = [
      { cursoId: cursosCreated[0].id, turno: TurnoEnum.MANHA, periodoAtual: 1, quantidadeAlunos: 35, ano: 2024 },
      { cursoId: cursosCreated[0].id, turno: TurnoEnum.NOITE, periodoAtual: 3, quantidadeAlunos: 28, ano: 2024 },
      { cursoId: cursosCreated[1].id, turno: TurnoEnum.MANHA, periodoAtual: 1, quantidadeAlunos: 40, ano: 2024 },
      { cursoId: cursosCreated[1].id, turno: TurnoEnum.TARDE, periodoAtual: 5, quantidadeAlunos: 22, ano: 2024 },
      { cursoId: cursosCreated[2].id, turno: TurnoEnum.NOITE, periodoAtual: 1, quantidadeAlunos: 32, ano: 2024 },
      { cursoId: cursosCreated[3].id, turno: TurnoEnum.MANHA, periodoAtual: 2, quantidadeAlunos: 38, ano: 2024 },
      { cursoId: cursosCreated[3].id, turno: TurnoEnum.NOITE, periodoAtual: 4, quantidadeAlunos: 25, ano: 2024 },
    ];

    for (const turmaData of turmasData) {
      await turmaRepo.create(turmaData);
    }
    console.log('✅ Turmas criadas');

    console.log('🎉 Seed completo! Dados iniciais inseridos com sucesso.');
    console.log('\n📋 Resumo dos dados criados:');
    console.log(`👤 Usuários: 2 (admin: admin/admin123, coordenador: coordenador/coord123)`);
    console.log(`📚 Cursos: ${cursosCreated.length}`);
    console.log(`🏢 Salas: ${salasCreated.length}`);
    console.log(`⚙️ Configurações: ${configuracoes.length}`);
    console.log(`🎓 Turmas: ${turmasData.length}`);

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Conexão com banco encerrada');
    process.exit(0);
  }
}

if (require.main === module) {
  seed();
}

export default seed;