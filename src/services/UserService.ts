import { UserRepository } from '../repositories';
import { User, UserPerfil } from '../entities';
import { AppError } from '../middlewares';
import { HTTP_STATUS, ERROR_MESSAGES, VALIDATION_RULES } from '../utils/constants';

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
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

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
    // Validações
    this.validateUserData(userData);

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
      this.validateNome(userData.nome);
    }
    if (userData.username) {
      this.validateUsername(userData.username);
    }
    if (userData.senha) {
      this.validateSenha(userData.senha);
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

  async getUsersWithPagination(page: number = 1, limit: number = 10): Promise<{
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

  private validateUserData(userData: CreateUserData): void {
    this.validateNome(userData.nome);
    this.validateUsername(userData.username);
    this.validateSenha(userData.senha);
    this.validatePerfil(userData.perfil);
  }

  private validateNome(nome: string): void {
    if (!nome || nome.trim().length < VALIDATION_RULES.NOME_MIN_LENGTH) {
      throw new AppError(
        `Nome deve ter pelo menos ${VALIDATION_RULES.NOME_MIN_LENGTH} caracteres`,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    if (nome.length > VALIDATION_RULES.NOME_MAX_LENGTH) {
      throw new AppError(
        `Nome deve ter no máximo ${VALIDATION_RULES.NOME_MAX_LENGTH} caracteres`,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }

  private validateUsername(username: string): void {
    if (!username || username.trim().length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
      throw new AppError(
        `Username deve ter pelo menos ${VALIDATION_RULES.USERNAME_MIN_LENGTH} caracteres`,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    if (username.length > VALIDATION_RULES.USERNAME_MAX_LENGTH) {
      throw new AppError(
        `Username deve ter no máximo ${VALIDATION_RULES.USERNAME_MAX_LENGTH} caracteres`,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new AppError(
        'Username deve conter apenas letras, números e underscores',
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }

  private validateSenha(senha: string): void {
    if (!senha || senha.length < VALIDATION_RULES.SENHA_MIN_LENGTH) {
      throw new AppError(
        `Senha deve ter pelo menos ${VALIDATION_RULES.SENHA_MIN_LENGTH} caracteres`,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }

  private validatePerfil(perfil: UserPerfil): void {
    if (!Object.values(UserPerfil).includes(perfil)) {
      throw new AppError('Perfil inválido', HTTP_STATUS.BAD_REQUEST);
    }
  }
}
