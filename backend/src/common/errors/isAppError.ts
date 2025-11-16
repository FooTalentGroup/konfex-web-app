export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: string[] | Record<string, unknown>;

  constructor(
    message: string,
    statusCode = 400,
    details?: string[] | Record<string, unknown>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};