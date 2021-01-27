import { NextFunction, Request, Response } from 'express';
import { Unauthorized } from '../error/unauthorized.error';
import { HttpExpress } from '../security/httpExpress.security';
import { JWT } from '../security/jwt.security';

export default function (req: Request, res: Response, next: NextFunction) {
  const token: string = HttpExpress.retriveBearerTokenFromRequest(req);

  if (!JWT.isTokenValid(token, false)) throw new Unauthorized(`Unauthorized`);

  next();
}
