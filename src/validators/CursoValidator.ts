import { AppError } from '../middlewares';
import { HTTP_STATUS, VALIDATION_RULES } from '../utils/constants';

export class CursoValidator {
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

  static validateDuracao(duracao: number | undefined): void {
    if (duracao === undefined || duracao <= 0) {
      throw new AppError('Duração deve ser um número positivo', HTTP_STATUS.BAD_REQUEST);
    }
  }

  static validateEvasao(evasao: number | undefined): void {
    if (evasao !== undefined && (evasao < 0 || evasao > 100)) {
      throw new AppError('Evasão deve ser um número entre 0 e 100', HTTP_STATUS.BAD_REQUEST);
    }
  }
}
