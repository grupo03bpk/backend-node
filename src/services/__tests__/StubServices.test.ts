import { ConfiguracaoSalaService } from '../ConfiguracaoSalaService';
import { PrevisaoService } from '../PrevisaoService';
import { SalaService } from '../SalaService';
const mockRepository = {
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue(true),
  findWithPagination: jest.fn().mockResolvedValue([[], 0]),
};

describe('Stub services', () => {
  test('ConfiguracaoSalaService.findAll retorna array', async () => {
    const s = new ConfiguracaoSalaService(mockRepository as any);
    const res = await s.findAll();
    expect(Array.isArray(res)).toBeTruthy();
  });

  test('PrevisaoService.findAll retorna array', async () => {
    const s = new PrevisaoService();
    const res = await s.findAll();
    expect(Array.isArray(res)).toBeTruthy();
  });

  test('SalaService.findAll retorna array', async () => {
    const s = new SalaService(mockRepository as any);
    const res = await s.findAll();
    expect(Array.isArray(res)).toBeTruthy();
  });
});
