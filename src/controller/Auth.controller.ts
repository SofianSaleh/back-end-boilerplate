import { Request, Response } from 'express';
import { Database } from '../database';
import { LoginDTO } from '../dto/request/login.dto';
import { RefreshTokenDTO } from '../dto/request/refreshToken.dto';
import { AuthenticationDTO } from '../dto/response/authentication.dto';
import { RefreshToken } from '../entity/RefreshToken';
import { NotFound } from '../error/notFound.error';
import { Unauthorized } from '../error/unauthorized.error';
import { HttpExpress } from '../security/httpExpress.security';
import { JWT } from '../security/jwt.security';
import { AuthService, AuthServiceIMPL } from '../service/auth.service';
import { EntityToDTO } from '../util/entityToDTO';
import { BaseController } from './Base.controller';

export class AuthController extends BaseController {
  private readonly authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthServiceIMPL();
  }

  protected initializeEndpoints() {
    this.addAsyncPoint(
      'POST',
      '/api/v1/auth/refresh',
      this.generateRefreshToken
    );
    this.addAsyncPoint('POST', '/api/v1/auth/login', this.login);
  }
  // ! FUNCTIONS MUST BE AN ARROW FUNCTION BECAUSE OF THE "THIS" PROBLEM
  public generateRefreshToken = async (req: Request, res: Response) => {
    const body: RefreshTokenDTO = req.body;
    const auth = await this.authService.generateRefreshToken(body);
    res.json(auth);
  };

  public login = async (req: Request, res: Response) => {
    const { email, password }: LoginDTO = req.body;

    const auth = await this.authService.login(email, password);

    res.json(auth);
  };

  public logout = async (req: Request, res: Response) => {
    let token: string = HttpExpress.retriveBearerTokenFromRequest(req);

    const authenticationDTO = await this.authService.logout(token);

    res.json(authenticationDTO);
  };
}
