/* eslint-disable @typescript-eslint/no-var-requires */
describe('UserService', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('getAllUsers chama repository findAll', async () => {
    const fakeUsers = [{ id: 1, nome: 'A' }];
    const findAll = jest.fn().mockResolvedValue(fakeUsers);
    jest.doMock('../../repositories', () => ({ UserRepository: jest.fn().mockImplementation(() => ({ findAll })) }));

    const { UserService } = require('../UserService');
    const service = new UserService();

    const res = await service.getAllUsers();
    expect(res).toBe(fakeUsers);
    expect(findAll).toHaveBeenCalled();
  });

  test('getUserById não encontrado lança erro', async () => {
    const findById = jest.fn().mockResolvedValue(null);
    jest.doMock('../../repositories', () => ({ UserRepository: jest.fn().mockImplementation(() => ({ findById })) }));

    const { UserService } = require('../UserService');
    const service = new UserService();

    await expect(service.getUserById(99)).rejects.toThrow();
  });

  test('createUser valida username duplicado e lança erro', async () => {
    const findByUsername = jest.fn().mockResolvedValue({ id: 2 });
    jest.doMock('../../repositories', () => ({ UserRepository: jest.fn().mockImplementation(() => ({ findByUsername })) }));

    const { UserService } = require('../UserService');
    const service = new UserService();

    await expect(service.createUser({ nome: 'X', username: 'u', senha: '123456', perfil: 'USER' })).rejects.toThrow();
  });
});
