/**
 * Centralized export for all middleware
 */
export {
  authenticate,
  authorize,
  adminOnly,
  hrOrAdminOnly,
  optionalAuth,
  rateLimit,
  loginRateLimit,
} from "./auth.middleware.js";

export {
  validate,
  validateBody,
  validateQuery,
  validateParams,
} from "./validation.middleware.js";

export {
  errorHandler,
  notFoundHandler,
  asyncHandler,
} from "./error.middleware.js";
