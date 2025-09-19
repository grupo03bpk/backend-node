import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const validateRequired = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields: string[] = [];

    fields.forEach((field) => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      throw new AppError(
        `Campos obrigatórios ausentes: ${missingFields.join(', ')}`,
        400
      );
    }

    next();
  };
};

export const validateEmail = (req: Request, res: Response, next: NextFunction): void => {
  const { email } = req.body;
  
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError('Formato de email inválido', 400);
    }
  }
  
  next();
};

export const validateId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  
  if (isNaN(Number(id))) {
    throw new AppError('ID deve ser um número válido', 400);
  }
  
  next();
};
