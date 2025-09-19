import { UserRepository } from '../repositories';
import { generateToken } from '../utils';
import { AppError } from '../middlewares';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';

export interface LoginData {
  username: string;
  senha: string;
}

export interface AuthResponse {
  user: {
    id: number;
    nome: string;
    username: string;
    perfil: string;
  };
  token: string;
}

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(loginData: LoginData): Promise<AuthResponse> {
    const { username, senha } = loginData;

    // Buscar usuário pelo username
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(senha);
    if (!isPasswordValid) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    // Gerar token
    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        nome: user.nome,
        username: user.username,
        perfil: user.perfil,
      },
      token,
    };
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      // A validação do token já é feita no middleware de autenticação
      // Este método pode ser usado para validações adicionais se necessário
      return true;
    } catch (error) {
      return false;
    }
  }
}
