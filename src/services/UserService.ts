import { User, UserPerfil } from '../entities';
import { AppError } from '../middlewares';
import { UserRepository } from '../repositories';
import { ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants';
import { UserValidator } from '../validators/UserValidator';

export interface CreateUserData {
  nome: string;
  username: string;
  senha: string;
  perfil: UserPerfil;
}

export interface UpdateUserData {
  nome?: string;
  username?: string;
  senha?: string;
  perfil?: UserPerfil;
}

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    return user;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    UserValidator.validateNome(userData.nome);
    UserValidator.validateUsername(userData.username);
    UserValidator.validateSenha(userData.senha);
    UserValidator.validatePerfil(userData.perfil);

    // Verificar se username já existe
    const existingUser = await this.userRepository.findByUsername(userData.username);
    if (existingUser) {
      throw new AppError('Username já está em uso', HTTP_STATUS.CONFLICT);
    }

    return this.userRepository.create(userData);
  }

  async updateUser(id: number, userData: UpdateUserData): Promise<User> {
    // Verificar se usuário existe
    const existingUser = await this.getUserById(id);

    // Se está atualizando username, verificar se não conflita
    if (userData.username && userData.username !== existingUser.username) {
      const userWithSameUsername = await this.userRepository.findByUsername(userData.username);
      if (userWithSameUsername) {
        throw new AppError('Username já está em uso', HTTP_STATUS.CONFLICT);
      }
    }

    // Validar dados se fornecidos
    if (userData.nome) {
      UserValidator.validateNome(userData.nome);
    }
    if (userData.username) {
      UserValidator.validateUsername(userData.username);
    }
    if (userData.senha) {
      UserValidator.validateSenha(userData.senha);
    }

    const updatedUser = await this.userRepository.update(id, userData);
    if (!updatedUser) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUserById(id);

    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new AppError('Erro ao deletar usuário', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async getUsersWithPagination(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    users: User[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const [users, total] = await this.userRepository.findWithPagination(page, limit);

    return {
      users,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
}
