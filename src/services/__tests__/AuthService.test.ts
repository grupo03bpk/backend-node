/* eslint-disable @typescript-eslint/no-var-requires */
describe('AuthService', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('login - sucesso retorna user e token', async () => {
    const mockUser = {
      id: 1,
      nome: 'Tester',
      username: 'tester',
      perfil: 'ADMIN',
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    const findByUsername = jest.fn().mockResolvedValue(mockUser);
    jest.doMock('../../repositories', () => ({
      UserRepository: jest.fn().mockImplementation(() => ({ findByUsername })),
    }));

    const generateToken = jest.fn().mockReturnValue('fake-token');
    jest.doMock('../../utils', () => ({ generateToken }));

    const { AuthService } = require('../AuthService');
    const service = new AuthService();

    const result = await service.login({ username: 'tester', senha: 'x' });

    expect(result).toHaveProperty('user');
    expect(result.token).toBe('fake-token');
    expect(findByUsername).toHaveBeenCalledWith('tester');
  });

  test('login - username inexistente lança erro', async () => {
    jest.doMock('../../repositories', () => ({
      UserRepository: jest.fn().mockImplementation(() => ({ findByUsername: jest.fn().mockResolvedValue(null) })),
    }));
    jest.doMock('../../utils', () => ({ generateToken: jest.fn() }));

    const { AuthService } = require('../AuthService');
    const service = new AuthService();

    await expect(service.login({ username: 'noone', senha: 'x' })).rejects.toThrow();
  });

  test('login - senha inválida lança erro', async () => {
    const mockUser = {
      id: 2,
      nome: 'User',
      username: 'user',
      perfil: 'USER',
      comparePassword: jest.fn().mockResolvedValue(false),
    };

    jest.doMock('../../repositories', () => ({
      UserRepository: jest.fn().mockImplementation(() => ({ findByUsername: jest.fn().mockResolvedValue(mockUser) })),
    }));
    jest.doMock('../../utils', () => ({ generateToken: jest.fn() }));

    const { AuthService } = require('../AuthService');
    const service = new AuthService();

    await expect(service.login({ username: 'user', senha: 'wrong' })).rejects.toThrow();
  });
});
