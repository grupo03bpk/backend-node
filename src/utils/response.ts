import { Response } from 'express';
import { HTTP_STATUS } from './constants';

interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
  data?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export const sendSuccess = (
  res: Response,
  data?: any,
  message?: string,
  statusCode: number = HTTP_STATUS.OK
): void => {
  const response: ApiResponse = {
    status: 'success',
    ...(message && { message }),
    ...(data && { data }),
  };

  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
): void => {
  const response: ApiResponse = {
    status: 'error',
    message,
  };

  res.status(statusCode).json(response);
};

export const sendPaginatedResponse = (
  res: Response,
  data: any[],
  page: number,
  limit: number,
  total: number,
  message?: string
): void => {
  const totalPages = Math.ceil(total / limit);
  
  const response: ApiResponse = {
    status: 'success',
    ...(message && { message }),
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };

  res.status(HTTP_STATUS.OK).json(response);
};
