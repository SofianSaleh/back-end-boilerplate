import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../error/httpError.error';

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof HttpError) {
    const httpErr: HttpError = <HttpError>err;

    res.status(httpErr.statusCode).json({
      statusCode: httpErr.statusCode,
      message: httpErr.message,
    });
    return;
  }

  res.status(500).json({
    statusCode: 500,
    message: err.message,
  });
};
