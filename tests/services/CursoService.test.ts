import { CursoService } from '../../src/services/CursoService';

// Mock minimal Curso object
const fakeCursos = [
  { id: 1, nome: 'Engenharia', duracao: 8, evasao: 0 },
  { id: 2, nome: 'Matemática', duracao: 6, evasao: 0 },
];

const mockRepository = {
  findAll: jest.fn().mockResolvedValue(fakeCursos),
  findById: jest
    .fn()
    .mockImplementation((id: number) =>
      Promise.resolve(fakeCursos.find((c) => c.id === id) ?? null)
    ),
  findByNome: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockImplementation((data) => Promise.resolve({ id: 3, ...data })),
  update: jest.fn().mockImplementation((id, data) => Promise.resolve({ id, ...data })),
  delete: jest.fn().mockResolvedValue(true),
  findWithPagination: jest.fn().mockResolvedValue([fakeCursos, fakeCursos.length]),
  findCursosComEstatisticas: jest.fn().mockResolvedValue([]),
};

describe('CursoService', () => {
  let service: CursoService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CursoService(mockRepository as any);
  });

  test('findAll retorna lista de cursos', async () => {
    const cursos = await service.findAll();
    expect(cursos).toHaveLength(2);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  test('findById lança erro quando não encontra', async () => {
    await expect(service.findById(999)).rejects.toThrow();
  });

  test('create cria um curso com dados válidos', async () => {
    const novo = await service.create({ nome: 'Física', duracao: 6 });
    expect(novo).toHaveProperty('id');
    expect(mockRepository.create).toHaveBeenCalled();
  });
});
