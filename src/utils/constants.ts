export const SEMESTRES = [1, 2] as const;
export const TURNOS = ['manha', 'tarde', 'noite'] as const;
export const PERFIS_USUARIO = ['admin', 'coordenador'] as const;

export const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  NOME_MIN_LENGTH: 2,
  NOME_MAX_LENGTH: 100,
  SENHA_MIN_LENGTH: 6,
  CURSO_DURACAO_MIN: 1,
  CURSO_DURACAO_MAX: 12,
  ANO_MIN: 2020,
  ANO_MAX: 2050,
} as const;

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'Usuário não encontrado',
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  UNAUTHORIZED: 'Não autorizado',
  FORBIDDEN: 'Acesso negado',
  INTERNAL_ERROR: 'Erro interno do servidor',
  VALIDATION_ERROR: 'Dados de entrada inválidos',
  DUPLICATE_ENTRY: 'Entrada duplicada',
  RESOURCE_NOT_FOUND: 'Recurso não encontrado',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
