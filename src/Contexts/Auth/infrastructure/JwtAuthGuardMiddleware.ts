import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { TokenGenerator } from '../domain/TokenGenerator';

const DEFAULT_SKIP_PATHS = ['/auth/signup', '/auth/signin', '/auth/refresh-token', '/status'];

export function createJwtAuthGuardMiddleware(
  tokenGenerator: TokenGenerator,
  skipPaths: string[] = DEFAULT_SKIP_PATHS
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (skipPaths.includes(req.path)) {
      next();
      return;
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(httpStatus.UNAUTHORIZED).json({ error: 'Missing or invalid Authorization header' });
      return;
    }

    const token = authHeader.slice(7);

    try {
      const payload = await tokenGenerator.verify(token);
      (req as any).user = payload;
      next();
    } catch {
      res.status(httpStatus.UNAUTHORIZED).json({ error: 'Invalid or expired token' });
    }
  };
}
