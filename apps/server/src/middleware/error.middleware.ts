import type { Request, Response, NextFunction } from "express";
import {
  ResponseHelper,
  HttpStatus,
  AppError,
} from "../utils/response.utils.js";

/**
 * Global Error Handler Middleware
 * Catches all errors and returns standardized responses
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", error);

  // Handle custom AppError instances
  if (error instanceof AppError) {
    res.status(error.statusCode).json(ResponseHelper.error(error.message));
    return;
  }

  // Handle Mongoose validation errors
  if (error.name === "ValidationError") {
    const messages = Object.values((error as any).errors).map(
      (err: any) => err.message
    );
    res
      .status(HttpStatus.BAD_REQUEST)
      .json(ResponseHelper.validationError(messages));
    return;
  }

  // Handle Mongoose duplicate key errors
  if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyValue)[0];
    res
      .status(HttpStatus.CONFLICT)
      .json(ResponseHelper.error(`${field} already exists`));
    return;
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (error.name === "CastError") {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json(ResponseHelper.error("Invalid ID format"));
    return;
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    res
      .status(HttpStatus.UNAUTHORIZED)
      .json(ResponseHelper.error("Invalid token"));
    return;
  }

  if (error.name === "TokenExpiredError") {
    res
      .status(HttpStatus.UNAUTHORIZED)
      .json(ResponseHelper.error("Token has expired"));
    return;
  }

  // Default to internal server error
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json(
      ResponseHelper.error(
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message
      )
    );
};

/**
 * Not Found Handler Middleware
 * Catches all unmatched routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res
    .status(HttpStatus.NOT_FOUND)
    .json(
      ResponseHelper.error(`Route ${req.method} ${req.originalUrl} not found`)
    );
};

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
