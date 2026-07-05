import type { Request, Response, NextFunction } from 'express';

/**
 * Mock Authentication Middleware
 * Temporarily uses the 'x-user-id' header to identify the user
 * until real JWT authentication is implemented.
 */
export const mockAuth = (req: Request, res: Response, next: NextFunction): void => {
  const userId = req.headers['x-user-id'];

  if (!userId || typeof userId !== 'string') {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid x-user-id header' });
    return;
  }

  res.locals.userId = userId;
  
  next();
};
