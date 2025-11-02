import { UserPerfil } from '../entities';
import { AppError } from '../middlewares';
import { HTTP_STATUS, VALIDATION_RULES } from '../utils/constants';

export class UserValidator {
  static validateNome(nome: string): void {
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

  static validateUsername(username: string): void {
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

  static validateSenha(senha: string): void {
    if (!senha || senha.length < VALIDATION_RULES.SENHA_MIN_LENGTH) {
      throw new AppError(
        `Senha deve ter pelo menos ${VALIDATION_RULES.SENHA_MIN_LENGTH} caracteres`,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }

  static validatePerfil(perfil: UserPerfil): void {
    if (!Object.values(UserPerfil).includes(perfil)) {
      throw new AppError('Perfil inválido', HTTP_STATUS.BAD_REQUEST);
    }
  }
}
