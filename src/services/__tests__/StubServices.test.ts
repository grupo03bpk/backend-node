import { ConfiguracaoSalaService } from '../ConfiguracaoSalaService';
import { PrevisaoService } from '../PrevisaoService';
import { SalaService } from '../SalaService';

describe('Stub services', () => {
  test('ConfiguracaoSalaService.findAll retorna array', async () => {
    const s = new ConfiguracaoSalaService();
    const res = await s.findAll();
    expect(Array.isArray(res)).toBeTruthy();
  });

  test('PrevisaoService.findAll retorna array', async () => {
    const s = new PrevisaoService();
    const res = await s.findAll();
    expect(Array.isArray(res)).toBeTruthy();
  });

  test('SalaService.findAll retorna array', async () => {
    const s = new SalaService();
    const res = await s.findAll();
    expect(Array.isArray(res)).toBeTruthy();
  });
});
