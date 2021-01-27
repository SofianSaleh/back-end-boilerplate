/**
 * This is the controller where other controllers inherit from this is the Father of controllers
 * This is an abstract class
 */

import { Express, NextFunction, Request, Response } from 'express';
import { HttpExpress } from '../security/httpExpress.security';
// import { HttpExpress } from '../security/httpExpress';

// * Todo: security http methods
export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export abstract class BaseController {
  private app: Express;

  // constructor() {}

  public initializeController(app: Express) {
    this.app = app;
    this.initializeEndpoints();
  }

  protected abstract initializeEndpoints();

  /**
   *
   * @param httpMethod Defined Above 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
   * @param route The endpoint you are supposed to hit
   * @param fn In this case if you want a route that DOES NOT returns a promise then you call the function
   * @param middlewares Any middlewares you want to add
   */
  public addEndpoint(
    httpMethod: HttpMethods,
    route: string,
    fn: (req: Request, res: Response, next?: NextFunction) => any,
    ...middlewares: ((req: Request, res: Response, next: NextFunction) => any)[]
  ) {
    switch (httpMethod) {
      case 'GET':
        middlewares
          ? this.app.get(route, middlewares, fn)
          : this.app.get(route, fn);
        break;
      case 'POST':
        middlewares
          ? this.app.post(route, middlewares, fn)
          : this.app.post(route, fn);
        break;
      case 'PUT':
        middlewares
          ? this.app.put(route, middlewares, fn)
          : this.app.put(route, fn);
        break;
      case 'DELETE':
        middlewares
          ? this.app.delete(route, middlewares, fn)
          : this.app.delete(route, fn);
        break;
      case 'PATCH':
        middlewares
          ? this.app.patch(route, middlewares, fn)
          : this.app.patch(route, fn);
        break;
    }
  }
  /**
   *
   * @param httpMethod Defined Above 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
   * @param route The endpoint you are supposed to hit
   * @param fn In this case if you want a route that returns a promise then you call the function from HTTPEXPRESS
   * @param middlewares Any middlewares you want to add
   */
  public addAsyncPoint(
    httpMethod: HttpMethods,
    route: string,
    fn: (req: Request, res: Response, next?: NextFunction) => any,
    ...middlewares: ((req: Request, res: Response, next: NextFunction) => any)[]
  ) {
    this.addEndpoint(
      httpMethod,
      route,
      HttpExpress.wrapAsync(fn),
      ...middlewares
    );
  }
}
