import AppDataSource from '../config/database';
import { User, UserPerfil, Curso, TurnoEnum, TipoSalaEnum, TamanhoSalaEnum } from '../entities';
import { UserRepository, CursoRepository, SalaRepository, TurmaRepository, ConfiguracaoSalaRepository, ConfiguracaoPrevisaoRepository } from '../repositories';

async function seed() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    await AppDataSource.initialize();
    console.log('✅ Conectado ao banco de dados');

    console.log('🧹 Limpando dados antigos...');
    await AppDataSource.query('DELETE FROM previsoes_alocacao');
    await AppDataSource.query('DELETE FROM previsoes');
    await AppDataSource.query('DELETE FROM configuracoes_sala');
    await AppDataSource.query('DELETE FROM turmas');
    await AppDataSource.query('DELETE FROM salas');
    await AppDataSource.query('DELETE FROM cursos');
    await AppDataSource.query('DELETE FROM users');
    await AppDataSource.query('DELETE FROM configuracoes_previsao');
    console.log('✅ Dados antigos removidos');

    const userRepo = new UserRepository();
    const cursoRepo = new CursoRepository();
    const salaRepo = new SalaRepository();
    const turmaRepo = new TurmaRepository();
    const configRepo = new ConfiguracaoSalaRepository();
    const configPrevisaoRepo = new ConfiguracaoPrevisaoRepository();

    console.log('👤 Criando usuário administrador...');
    const adminExistente = await userRepo.findByUsername('admin');
    if (!adminExistente) {
      await userRepo.create({
        nome: 'Administrador',
        username: 'admin',
        senha: 'admin123',
        perfil: UserPerfil.ADMIN,
      });
      console.log('✅ Usuário administrador criado');
    } else {
      console.log('ℹ️ Usuário administrador já existe');
    }

    const coordenadorExistente = await userRepo.findByUsername('coordenador');
    if (!coordenadorExistente) {
      await userRepo.create({
        nome: 'João Coordenador',
        username: 'coordenador',
        senha: 'coord123',
        perfil: UserPerfil.COORDENADOR,
      });
      console.log('✅ Usuário coordenador criado');
    } else {
      console.log('ℹ️ Usuário coordenador já existe');
    }

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
      { numero: '104', bloco: 'B' },
      { numero: '201', bloco: 'B' },
      { numero: 'LAB1', bloco: 'C' },
      { numero: 'LAB2', bloco: 'C' },
      { numero: 'LAB3', bloco: 'C' },
      { numero: '105', bloco: 'A' },
      { numero: '106', bloco: 'A' },
      { numero: '203', bloco: 'A' },
      { numero: '204', bloco: 'A' },
      { numero: '205', bloco: 'A' },
      { numero: '206', bloco: 'A' },
      { numero: '207', bloco: 'A' }
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
      { salaId: salasCreated[0].id, ano: 2025, semestre: 2, tamanho: TamanhoSalaEnum.M, tipo: TipoSalaEnum.AULA },
      { salaId: salasCreated[1].id, ano: 2025, semestre: 2, tamanho: TamanhoSalaEnum.P, tipo: TipoSalaEnum.AULA },
      { salaId: salasCreated[2].id, ano: 2025, semestre: 2, tamanho: TamanhoSalaEnum.G, tipo: TipoSalaEnum.AULA },
      { salaId: salasCreated[3].id, ano: 2025, semestre: 2, tamanho: TamanhoSalaEnum.M, tipo: TipoSalaEnum.AULA },
      { salaId: salasCreated[4].id, ano: 2025, semestre: 2, tamanho: TamanhoSalaEnum.G, tipo: TipoSalaEnum.AULA },
      { salaId: salasCreated[5].id, ano: 2025, semestre: 2, tamanho: TamanhoSalaEnum.M, tipo: TipoSalaEnum.AULA },
      { salaId: salasCreated[6].id, ano: 2025, semestre: 2, tamanho: TamanhoSalaEnum.P, tipo: TipoSalaEnum.AULA },
      { salaId: salasCreated[7].id, ano: 2025, semestre: 2, tamanho: TamanhoSalaEnum.G, tipo: TipoSalaEnum.AULA }
    ];

    for (const configData of configuracoes) {
      await configRepo.create(configData);
    }
    console.log('✅ Configurações de sala criadas');

    console.log('🔮 Criando configuração de previsão...');
    const configPrevisao = await configPrevisaoRepo.create({
      capacidadeSalaP: 30,
      capacidadeSalaM: 42,
      capacidadeSalaG: 60,
      areaPorAlunoM2: 2.96,
      taxaEvasaoPercentual: 7.2,
    });
    console.log('✅ Configuração de previsão criada');

    console.log('🎓 Criando turmas...');
    const turmasData = [
      { cursoId: cursosCreated[0].id, turno: TurnoEnum.MANHA, periodoAtual: 1, quantidadeAlunos: 28, ano: 2025 },
      { cursoId: cursosCreated[1].id, turno: TurnoEnum.NOITE, periodoAtual: 3, quantidadeAlunos: 40, ano: 2025 },
      { cursoId: cursosCreated[2].id, turno: TurnoEnum.TARDE, periodoAtual: 5, quantidadeAlunos: 60, ano: 2025 },
      { cursoId: cursosCreated[3].id, turno: TurnoEnum.MANHA, periodoAtual: 2, quantidadeAlunos: 65, ano: 2025 },
      { cursoId: cursosCreated[0].id, turno: TurnoEnum.NOITE, periodoAtual: 4, quantidadeAlunos: 45, ano: 2025 },
      { cursoId: cursosCreated[1].id, turno: TurnoEnum.TARDE, periodoAtual: 2, quantidadeAlunos: 31, ano: 2025 },
      { cursoId: cursosCreated[2].id, turno: TurnoEnum.NOITE, periodoAtual: 6, quantidadeAlunos: 80, ano: 2025 },
      { cursoId: cursosCreated[3].id, turno: TurnoEnum.TARDE, periodoAtual: 3, quantidadeAlunos: 29, ano: 2025 },
      { cursoId: cursosCreated[0].id, turno: TurnoEnum.MANHA, periodoAtual: 5, quantidadeAlunos: 42, ano: 2025 },
      { cursoId: cursosCreated[1].id, turno: TurnoEnum.NOITE, periodoAtual: 7, quantidadeAlunos: 61, ano: 2025 }
    ];

    // Associar turmas a salas conforme capacidade e exclusividade
    for (let i = 0; i < turmasData.length; i++) {
      const turmaData = turmasData[i];
      // Encontrar uma sala disponível que comporte a turma
      let salaAssociada = null;
      for (const sala of salasCreated) {
        // Buscar configuração vigente da sala
        const config = await configRepo.findBySala(sala.id);
        const configVigente = config[0];
        if (configVigente && typeof configVigente.capacidade === 'number' && turmaData.quantidadeAlunos <= configVigente.capacidade) {
          // Verificar se sala já está associada a outra turma
          const turmasExistentes = await turmaRepo.findAll();
          if (!turmasExistentes.some(t => t.salaId === sala.id)) {
            salaAssociada = sala.id;
            break;
          }
        }
      }
      await turmaRepo.create({ ...turmaData, salaId: salaAssociada ?? undefined });
    }
    console.log('✅ Turmas criadas e associadas a salas quando possível');

    console.log('🎉 Seed completo! Dados iniciais inseridos com sucesso.');
    console.log('\n📋 Resumo dos dados criados:');
    console.log(`👤 Usuários: 2 (admin: admin/admin123, coordenador: coordenador/coord123)`);
    console.log(`📚 Cursos: ${cursosCreated.length}`);
    console.log(`🏢 Salas: ${salasCreated.length}`);
    console.log(`⚙️ Configurações: ${configuracoes.length}`);
    console.log(`🔮 Configuração de Previsão: 1`);
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