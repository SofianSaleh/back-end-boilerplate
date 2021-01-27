import { HttpError } from './httpError.error';

export class NotFound extends HttpError {
  public statusCode = 404;
}
