import { HttpError } from './httpError.error';

export class BadRequest extends HttpError {
  public statusCode = 400;
}
