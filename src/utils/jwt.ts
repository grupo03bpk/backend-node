import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';
import { User } from '../entities';

export interface JWTPayload {
  id: number;
  username: string;
  perfil: string;
}

export const generateToken = (user: User): string => {
  const payload: JWTPayload = {
    id: user.id,
    username: user.username,
    perfil: user.perfil,
  };

  return jwt.sign(payload, authConfig.jwt.secret, {
    expiresIn: authConfig.jwt.expiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, authConfig.jwt.secret) as JWTPayload;
};
