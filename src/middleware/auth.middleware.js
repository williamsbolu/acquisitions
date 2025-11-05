import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      logger.warn('Authentication failed: No token provided');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided',
      });
    }

    const decoded = jwttoken.verify(token);
    req.user = decoded;

    logger.info(`User authenticated: ${decoded.email} (ID: ${decoded.id})`);
    next();
  } catch (e) {
    logger.error('Authentication failed:', e);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};

export const requireRole = allowedRoles => {
  return (req, res, next) => {
    if (!req.user) {
      logger.error('Role check failed: No user found in request');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const userRole = req.user.role;
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(userRole)) {
      logger.warn(
        `Access denied: User ${req.user.id} with role "${userRole}" tried to access route requiring roles: ${roles.join(', ')}`
      );
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required roles: ${roles.join(', ')}`,
      });
    }

    logger.info(
      `Role check passed: User ${req.user.id} has role "${userRole}"`
    );
    next();
  };
};
