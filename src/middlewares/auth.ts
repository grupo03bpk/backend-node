import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';
import { User, UserPerfil } from '../entities';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    perfil: UserPerfil;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Token de acesso requerido' });
      return;
    }

    const decoded = jwt.verify(token, authConfig.jwt.secret) as any;
    req.user = {
      id: decoded.id,
      username: decoded.username,
      perfil: decoded.perfil,
    };

    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido' });
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Usuário não autenticado' });
    return;
  }

  if (req.user.perfil !== UserPerfil.ADMIN) {
    res.status(403).json({ message: 'Acesso negado. Requer perfil de administrador' });
    return;
  }

  next();
};

export { AuthenticatedRequest };
