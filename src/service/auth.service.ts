import { Database } from '../database';
import { RefreshTokenDTO } from '../dto/request/refreshToken.dto';
import { AuthenticationDTO } from '../dto/response/authentication.dto';
import { RefreshToken } from '../entity/RefreshToken';
import { NotFound } from '../error/notFound.error';
import { Unauthorized } from '../error/unauthorized.error';
import { JWT } from '../security/jwt.security';
import { PasswordHash } from '../security/passwordHash.security';
import { EntityToDTO } from '../util/entityToDTO';

export interface AuthService {
  generateRefreshToken(body: RefreshTokenDTO);
  login(email: string, password: string);
  logout(token: string);
}

export class AuthServiceIMPL implements AuthService {
  public async generateRefreshToken(body: RefreshTokenDTO) {
    if (!JWT.isTokenValid(body.token, true))
      throw new Unauthorized('Unauthorized Unvalid token');

    // *   Todo:Get the JWT id from normal token
    const jwtId = JWT.getJwtPayloadValueByKey(body.token, 'jti');

    // * Fetch the refresh token
    const refreshToken: RefreshToken = await Database.refreshTokenRepository.findOne(
      {
        id: body.refreshToken,
      }
    );

    // *   Todo: Check if the refresh token is linked with the normal token
    if (!(await JWT.isRefreshTokenLinkedWithToken(refreshToken, jwtId)))
      throw new Unauthorized(
        `Unauthorized Normal token and refrsh token are not linked`
      );

    // *   Todo:Check if the refresh token is not expired.
    if (JWT.isRefreshTokenExpired(refreshToken.expiryDate))
      throw new Unauthorized(`Unauthorized Refresh token is expired`);

    // *   Todo:Check if the refresh token was not used before or has been Invalidated.
    if (
      JWT.isRefreshTokenIsInValidatedOrUsed(
        refreshToken.invalidated,
        refreshToken.used
      )
    )
      throw new Unauthorized(
        `Unauthorized Refresh token has been invalidated or used`
      );

    refreshToken.used = true;
    await Database.refreshTokenRepository.save(refreshToken);

    // * Todo: Fetch the user to create a new token
    const userId = JWT.getJwtPayloadValueByKey(body.token, 'id');
    const user = await Database.userRepository.findOne({
      id: userId,
    });

    if (!user) throw new NotFound(`User with the id: ${userId} not found`);

    // * Todo: Generate a fresh pair of token and refresh Token
    const tokenResults = await JWT.generateTokenAndRefreshToken(user);

    // *   Todo: Generate authentication response.
    const authenticationDTO: AuthenticationDTO = new AuthenticationDTO();
    authenticationDTO.user = EntityToDTO.userToDTO(user);
    authenticationDTO.token = tokenResults.token;
    authenticationDTO.refreshToken = tokenResults.refreshToken;

    return authenticationDTO;
  }

  /**
   *
   * @param email A string representing the email address
   * @param password A string representing the password
   * @return {Promise<AuthenticationDTO>}
   */
  public async login(
    email: string,
    password: string
  ): Promise<AuthenticationDTO> {
    // *   Todo: Fetch the user.
    const user = await Database.userRepository.findOne({ email });

    if (!user) throw new NotFound(`User with email: ${email} not found`);

    // *   Todo: Check password.
    if (!(await PasswordHash.isPasswordValid(password, user.password)))
      throw new Unauthorized(`Unauthorized`);

    // *   Todo: Generate tokens.
    const { token, refreshToken } = await JWT.generateTokenAndRefreshToken(
      user
    );

    // *   Todo: Generate Authentication response.
    const authenticationDTO: AuthenticationDTO = new AuthenticationDTO();
    authenticationDTO.user = EntityToDTO.userToDTO(user);
    authenticationDTO.token = token;
    authenticationDTO.refreshToken = refreshToken;

    return authenticationDTO;
  }

  public async logout(token: string): Promise<void> {}
}
