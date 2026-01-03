import type { Request, Response, NextFunction } from "express";
import { AuthUtils, type JWTPayload } from "../utils/auth.utils.js";
import {
  ResponseHelper,
  HttpStatus,
  UnauthorizedError,
  ForbiddenError,
} from "../utils/response.utils.js";
import { EmployeeRole } from "../validations/employee.validation.js";

/**
 * Extend Express Request to include user information
 */
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = AuthUtils.extractBearerToken(req.headers.authorization);

    if (!token) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ResponseHelper.error("Access token is required"));
      return;
    }

    try {
      const payload = AuthUtils.verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ResponseHelper.error(error.message));
        return;
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Authorization Middleware Factory
 * Creates middleware that checks if user has required role(s)
 */
export const authorize = (...allowedRoles: EmployeeRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ResponseHelper.error("Authentication required"));
        return;
      }

      if (!AuthUtils.hasRequiredRole(req.user.role, allowedRoles)) {
        res
          .status(HttpStatus.FORBIDDEN)
          .json(
            ResponseHelper.error(
              `Access denied. Required roles: ${allowedRoles.join(", ")}`
            )
          );
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Admin Only Middleware
 */
export const adminOnly = authorize(EmployeeRole.ADMIN);

/**
 * HR and Admin Only Middleware
 */
export const hrOrAdminOnly = authorize(EmployeeRole.HR, EmployeeRole.ADMIN);

/**
 * Optional Authentication Middleware
 * Attaches user info if token is present, but doesn't require it
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = AuthUtils.extractBearerToken(req.headers.authorization);

    if (token) {
      try {
        const payload = AuthUtils.verifyAccessToken(token);
        req.user = payload;
      } catch {
        // Token is invalid but we don't require it, so continue
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Rate Limiting Middleware (Simple in-memory implementation)
 * For production, use Redis-based rate limiting
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  maxRequests: number = 100
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || "unknown";
    const now = Date.now();

    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (record.count >= maxRequests) {
      res
        .status(429)
        .json(
          ResponseHelper.error("Too many requests. Please try again later.")
        );
      return;
    }

    record.count++;
    next();
  };
};

/**
 * Login Rate Limiting (Stricter for auth endpoints)
 */
export const loginRateLimit = rateLimit(15 * 60 * 1000, 5); // 5 attempts per 15 minutes

export default {
  authenticate,
  authorize,
  adminOnly,
  hrOrAdminOnly,
  optionalAuth,
  rateLimit,
  loginRateLimit,
};
