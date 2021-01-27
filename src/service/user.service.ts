import { plainToClass } from 'class-transformer';
import { Database } from '../database';
import { RegisterDTO } from '../dto/request/register.dto';
import { AuthenticationDTO } from '../dto/response/authentication.dto';
import { UserDTO } from '../dto/response/user.dto';
import { User } from '../entity/User';
import { BadRequest } from '../error/badRequest.error';
import { JWT } from '../security/jwt.security';
import { PasswordHash } from '../security/passwordHash.security';
import { EntityToDTO } from '../util/entityToDTO';

/**
 * To deal with this service follow these steps
 * 1- add your function to the interface like below
 * 2- create your function down below
 */

export interface UsersService {
  register(body: RegisterDTO);
  getUser(user: User);
}

export class UsersServiceIMPL implements UsersService {
  getUser(user: User) {
    const userDTO = plainToClass(UserDTO, user);

    return userDTO;
  }

  /**
   *
   * @param body Aceppts the interface from registerDTO
   * @returns {object} consists of Token, Refresh Token and user
   */
  public async register(body: RegisterDTO): Promise<AuthenticationDTO> {
    body;
    if (body.password !== body.repeatedPassword) {
      throw new BadRequest("Password don't match");
    }
    if (await Database.userRepository.findOne({ email: body.email })) {
      throw new BadRequest('Email is used');
    }

    const user = new User();
    user.username = body.username;
    user.email = body.email;
    user.password = await PasswordHash.hashPassword(body.password);
    user.age = body.age;
    await Database.userRepository.save(user);

    const authenticationDTO: AuthenticationDTO = new AuthenticationDTO();
    const userDTO: UserDTO = EntityToDTO.userToDTO(user);

    const { token, refreshToken } = await JWT.generateTokenAndRefreshToken(
      user
    );
    authenticationDTO.user = userDTO;
    authenticationDTO.token = token;
    authenticationDTO.refreshToken = refreshToken;

    return authenticationDTO;
  }
}
