import { AnyZodObject, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next({ status: 400, message: "Validation error", details: error.flatten() });
      }
      next(error);
    }
  };
