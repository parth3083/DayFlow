/**
 * API Response Interface
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * HTTP Status Codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * Response Helper Class
 * Provides standardized API response formatting
 */
export class ResponseHelper {
  /**
   * Success response
   */
  static success<T>(
    message: string,
    data?: T,
    meta?: ApiResponse["meta"]
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      ...(data !== undefined && { data }),
      ...(meta !== undefined && { meta }),
    };
  }

  /**
   * Error response
   */
  static error(message: string, errors?: string[]): ApiResponse {
    const response: ApiResponse = {
      success: false,
      message,
    };
    if (errors !== undefined) {
      response.errors = errors;
    }
    return response;
  }

  /**
   * Validation error response
   */
  static validationError(errors: string[]): ApiResponse {
    return {
      success: false,
      message: "Validation failed",
      errors,
    };
  }

  /**
   * Paginated response
   */
  static paginated<T>(
    message: string,
    data: T,
    page: number,
    limit: number,
    total: number
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

/**
 * Custom Error Classes
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request") {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists") {
    super(message, HttpStatus.CONFLICT);
  }
}

export class ValidationError extends AppError {
  public readonly errors: string[];

  constructor(errors: string[]) {
    super("Validation failed", HttpStatus.UNPROCESSABLE_ENTITY);
    this.errors = errors;
  }
}

export default ResponseHelper;
