export type SuccessPayload<T> = {
  statusCode?: number;
  message: string;
  data?: T | null;
};

export type ErrorPayload = {
  statusCode?: number;
  message: string;
  errors?: string[] | Record<string, unknown> | string | null;
};