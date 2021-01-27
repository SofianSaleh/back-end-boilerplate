import { Connection, createConnection, ObjectType, Repository } from 'typeorm';
import { RefreshToken } from './entity/RefreshToken';
import { User } from './entity/User';

export class Database {
  public static connection: Connection;
  public static userRepository: Repository<User>;
  public static refreshTokenRepository: Repository<RefreshToken>;

  /**
   * Used to get the main Tables
   */
  public static async initialize() {
    this.connection = await createConnection();
    this.userRepository = this.connection.getRepository(User);
    this.refreshTokenRepository = this.connection.getRepository(RefreshToken);
  }

  /**
   *
   * @param target String The table that you want to use
   */
  public static getRepository<Entity>(target: ObjectType<Entity>) {
    // return this.connection.getRepository(target);
  }
}
