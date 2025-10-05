// Barrel file: re-exporta todos os serviços da aplicação.
// Use este arquivo como ponto único para importar serviços em camadas superiores.
// Atenção: evite imports circulares — serviços não devem importar deste barrel.
// Exemplo: `import { UserService } from '@services';`

export { AuthService } from './AuthService';
export { UserService } from './UserService';
// export { ConfiguracaoSalaService } from './ConfiguracaoSalaService';
// export { CursoService } from './CursoService';
// export { PrevisaoService } from './PrevisaoService';
// export { SalaService } from './SalaService';
// export { TurmaService } from './TurmaService';
