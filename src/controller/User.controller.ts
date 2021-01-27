import { Request, Response } from 'express';
import { RegisterDTO } from '../dto/request/register.dto';
import { BaseController } from './Base.controller';
import { UsersService, UsersServiceIMPL } from '../service/user.service';
import { Database } from '../database';
import { User } from '../entity/User';

export class UsersController extends BaseController {
  private readonly usersService: UsersService;

  constructor() {
    super();
    this.usersService = new UsersServiceIMPL();
  }
  protected initializeEndpoints() {
    /**
     * INITIALAIZE END POINTS i.g this.addAsyncPoint('Methode','route',function, middleware)
     */
    this.addAsyncPoint('POST', '/api/v1/user/register', this.register);

    // ! add a JWT Middleware
    // this.addAsyncPoint('GET', '/api/v1/user/getOne', this.getUser);
  }

  public register = async (req: Request, res: Response) => {
    const user: RegisterDTO = req.body;
    // *   Todo: call the service
    const authentication = await this.usersService.register(user);
    res.json(authentication);
  };
  public getUser = async (req: Request, res: Response) => {
    const user = await Database.getRepository(User).findOne(req.body.id);
    const userDTO = await this.usersService.getUser(user);
    res.json(userDTO);
  };
}
