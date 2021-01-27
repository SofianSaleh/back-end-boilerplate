// import { NextFunction, Request, Response } from 'express';
import { Database } from '../database';
import { UserDTO } from '../dto/response/user.dto';
import { User } from '../entity/User';
import { NotFound } from '../error/notFound.error';
import { Unauthorized } from '../error/unauthorized.error';
import { JWT } from './jwt.security';

export class HttpExpress {
  /**
   *
   * @param req Gets the entire request object to find the headers where the token is saved.
   * @return {string} Where it contains the token
   */
  public static retriveBearerTokenFromRequest(req: Request): string {
    // * Get the entire authorization string
    let authHeader: string = req.headers.authorization;

    if (!authHeader) throw new Unauthorized('Unauthorized');

    // * Gets a substring from the length of the Bearer  to the end
    if (authHeader.startsWith('Bearer '))
      authHeader = authHeader.substring('Bearer '.length, authHeader.length);

    return authHeader;
  }

  /**
   *
   * @param req Gets the entire request object to find the user from the request
   * @return {UserDTO}
   */
  public static async getUserByRequest(req: Request): Promise<UserDTO> {
    const userId: string = this.getUserIdByRequest(req);

    const user: UserDTO = await Database.getRepository(User).findOne({
      id: userId,
    });

    if (!user) throw new NotFound(`User with the the id: ${userId} not found.`);

    return user;
  }
  /**
   *
   * @param req Gets the entire request object to find the id of the user from the request.
   * @return {string}
   */
  public static getUserIdByRequest(req: Request): string {
    const token: string = this.retriveBearerTokenFromRequest(req);

    return this.getUserIdByBearerToken(token);
  }

  /**
   * Gets the token calls the JWT class and returns id
   * @param token string
   * @return {string}
   */
  public static getUserIdByBearerToken(token: string): string {
    // * Todo: Call JWT class to get the token content
    const userId = JWT.getJwtPayloadValueByKey(token, 'id');
    return userId;
  } //
  /**
   *
   * @param fn Gets the function from async routes so it converts to a Promise
   */
  public static wrapAsync(
    fn: (req: Request, res: Response, next: NextFunction) => any
  ) {
    return function (req: Request, res: Response, next?: NextFunction) {
      fn(req, res, next).catch(next);
    };
  }
}
