import { NextFunction, Request, Response } from 'express';

import { ErrorResponse } from '../models/error';
import { logger } from '../utils/logger';

export const errorMiddleware = (
  error: ErrorResponse,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  Error.captureStackTrace(error, errorMiddleware);
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  logger.error({ error });
  res.status(status).send({
    requestId: error.requestId,
    status,
    message,
    code: error.code,
    timestamp: error.timestamp,
    source: error.source,
    errorData: error.errorData,
    stack: error.stack,
  });
};
