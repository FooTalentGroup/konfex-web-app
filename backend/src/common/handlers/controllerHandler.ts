import { Request, Response } from "express";
import { isAppError } from "../errors";
import { sendError, sendSuccess } from "../responses";

export function controllerHandler<T>(
  controllerFn: (req: Request) => Promise<T>,
  successMessage: string,
  statusCode: number = 200
) {
  return async (req: Request, res: Response) => {
    try {
      const data = await controllerFn(req);

      return sendSuccess(res, {
        statusCode,
        message: successMessage,
        data,
      });
    } catch (error: any) {
      console.error("Controller error:", error);

      if (isAppError(error)) {
        return sendError(res, {
          statusCode: error.statusCode,
          message: error.message,
          errors: error.details,
        });
      }

      return sendError(res, {
        statusCode: 500,
        message: "Ha ocurrido un error inesperado",
      });
    }
  };
}