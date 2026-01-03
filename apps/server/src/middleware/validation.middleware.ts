import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ResponseHelper, HttpStatus } from "../utils/response.utils.js";

/**
 * Request Validation Middleware Factory
 * Validates request body, query, or params against Zod schema
 */
export const validate = (
  schema: ZodSchema,
  target: "body" | "query" | "params" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req[target];
      const result = schema.safeParse(data);

      if (!result.success) {
        const errors = result.error.issues.map(
          (err) => `${err.path.join(".")}: ${err.message}`
        );

        res
          .status(HttpStatus.UNPROCESSABLE_ENTITY)
          .json(ResponseHelper.validationError(errors));
        return;
      }

      // Replace the target data with parsed/transformed data
      req[target] = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validate Request Body
 */
export const validateBody = (schema: ZodSchema) => validate(schema, "body");

/**
 * Validate Request Query
 */
export const validateQuery = (schema: ZodSchema) => validate(schema, "query");

/**
 * Validate Request Params
 */
export const validateParams = (schema: ZodSchema) => validate(schema, "params");

export default {
  validate,
  validateBody,
  validateQuery,
  validateParams,
};
