import { TurnoEnum } from '../../entities/Turma';
import { TurmaService } from '../TurmaService';

const fakeTurmas = [
  { id: 1, cursoId: 1, turno: TurnoEnum.MANHA, periodoAtual: 1, quantidadeAlunos: 30, ano: 2025 },
  { id: 2, cursoId: 1, turno: TurnoEnum.TARDE, periodoAtual: 1, quantidadeAlunos: 25, ano: 2025 },
];

const mockCursoRepository = {
  findById: jest.fn().mockResolvedValue({ id: 1, nome: 'Engenharia', duracao: 8, evasao: 0 }),
  findByNome: jest.fn().mockResolvedValue(null),
};

const mockRepository = {
  findAll: jest.fn().mockResolvedValue(fakeTurmas),
  findById: jest
    .fn()
    .mockImplementation((id: number) =>
      Promise.resolve(fakeTurmas.find((t) => t.id === id) ?? null)
    ),
  create: jest.fn().mockImplementation((data: any) => Promise.resolve({ id: 3, ...data })),
  update: jest.fn().mockImplementation((id: any, data: any) => Promise.resolve({ id, ...data })),
  delete: jest.fn().mockResolvedValue(true),
  findWithPagination: jest.fn().mockResolvedValue([fakeTurmas, fakeTurmas.length]),
};

describe('TurmaService', () => {
  let service: TurmaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TurmaService(mockRepository as any, mockCursoRepository as any);
  });

  test('findAll retorna lista de turmas', async () => {
    const turmas = await service.findAll();
    expect(turmas).toHaveLength(2);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  test('findById lança erro quando não encontra', async () => {
    await expect(service.findById(999)).rejects.toThrow();
  });

  test('create cria uma turma com dados válidos', async () => {
    const nova = await service.create({
      cursoId: 1,
      turno: TurnoEnum.MANHA,
      periodoAtual: 1,
      quantidadeAlunos: 20,
      ano: 2025,
    });
    expect(nova).toHaveProperty('id');
    expect(mockRepository.create).toHaveBeenCalled();
  });
});
