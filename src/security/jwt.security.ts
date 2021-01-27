import * as jwt from 'jsonwebtoken';
import { User } from '../entity/User';
import { v4 as uuidV4 } from 'uuid';
import { RefreshToken } from '../entity/RefreshToken';
import * as moment from 'moment';
import { Database } from '../database';
import { NotFound } from '../error/notFound.error';

export class JWT {
  /**
   *
   * @param user Gets the user object.
   * @return {token:string, refreshToken:string}
   */
  public static async generateTokenAndRefreshToken(
    user: User
  ): Promise<{ token: string; refreshToken: string }> {
    //   * Todo: Specify payload id from the user and {Email}
    //   * Todo: Specify a secret key
    const payload: { id: string; email: string } = {
      id: user.id,
      email: user.email,
    };
    const jwtId: string = uuidV4();
    const token: string = jwt.sign(payload, process.env.JWT_SECRET1, {
      expiresIn: '15m', // * Todo: Specify a duration for expiration 15min
      jwtid: jwtId, // * Todo: Specify a JWT id to use in the refresh token as a refresh token only points to one refresh token
      subject: user.id.toString(), // * Subject either user id or primary key
    });
    // * Create refresh token
    const refreshToken: string = await this.generateRefreshTokenForUserAndToken(
      user,
      jwtId
    );

    // * Link the token to the refresh token
    return { token, refreshToken };
  }

  /**
   *
   * @param user Object of the entier user.
   * @param jwtId And id so we can link token to jwt token.
   * @return {string}
   */
  private static async generateRefreshTokenForUserAndToken(
    user: User,
    jwtId: string
  ): Promise<string> {
    // * Initialize new Refreshtoken
    const refreshToken: RefreshToken = new RefreshToken();

    // * Add user jwtId and the expiry date
    refreshToken.user = user;
    refreshToken.jwtId = jwtId;
    refreshToken.expiryDate = moment().add(10, 'd').toDate();

    // * Save it to the database
    await Database.refreshTokenRepository.save(refreshToken);

    return refreshToken.id;
  }

  /**
   *
   * @param token A string representing the token to get the jwtId from
   * @param key A string representing the key we want to fetch
   * @return {string}
   */

  public static getJwtPayloadValueByKey(token: string, key: string): string {
    const decodedToken = jwt.decode(token);
    return decodedToken[key];
  }
  /**
   *
   * @param token A string representing the token
   * @param ignoreExpiration A boolean to specify if you want to ignore the expiration date.
   * @return {boolean}
   */
  public static isTokenValid(
    token: string,
    ignoreExpiration: boolean
  ): boolean {
    try {
      jwt.verify(token, process.env.JWT_SECRET1, {
        ignoreExpiration,
      });

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Takes the refresh token id and searches the database for a match and compares the JWTID to see a match
   * and then returns a boolean
   * @param refreshTokenId The id from the request to refresh token
   * @param jwtId The id taken from the normal token
   * @return {Promise Boolean}
   */
  static async isRefreshTokenLinkedWithToken(
    refreshToken: RefreshToken,
    jwtId: string
  ): Promise<boolean> {
    if (!refreshToken) return false;

    if (refreshToken.jwtId !== jwtId) return false;

    return true;
  }

  public static isRefreshTokenExpired(expiryDate: Date): boolean {
    if (moment().isAfter(expiryDate)) return true;
    return false;
  }

  public static isRefreshTokenIsInValidatedOrUsed(
    invalidated: boolean,
    used: boolean
  ): boolean {
    return invalidated || used;
  }
}
