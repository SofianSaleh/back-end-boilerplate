import * as bcrypt from 'bcryptjs';

export class PasswordHash {
  /**
   * Returns a hashed password
   * @param plainPassword This is a plain password
   * @returns {String}
   */
  public static async hashPassword(plainPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hash(plainPassword, salt);

    return hashedPassword;
  }
  /**
   *
   * @param plainPassword A password entered by the user
   * @param hashedPassword A password taken from the database
   * @returns {Boolean} if passwords match returns true else false
   */
  public static async isPasswordValid(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
