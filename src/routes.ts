import path from 'path';
import { Router } from 'express';
import { register, login, logout, loginStatus } from './authentication';
import {
  ValidationError,
  UnauthorizedError,
  SessionInitializationError,
  SessionDestructionError,
  NotFoundError,
} from './error/types';
import { NextFunction, Request, Response } from 'express';
import { getUsers } from './users';

const router = Router();

router.post('/login', login);
router.get('/login-status', loginStatus);
router.get('/logout', logout);
router.post('/register', register);

const authorizer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    next(new UnauthorizedError('you are not authenticated'));
  } else {
    next();
  }
};

router.get('/users', authorizer, getUsers);

router.get('/admin', authorizer, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

router.use((req: Request, res: Response, next: NextFunction): void => {
  next(new NotFoundError('Not Found', 404));
});

router.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (
      err instanceof UnauthorizedError ||
      err instanceof NotFoundError ||
      err instanceof ValidationError ||
      err instanceof SessionInitializationError ||
      err instanceof SessionDestructionError
    ) {
      statusCode = err.statusCode;
      message = err.message;
    }
    res
      .status(statusCode)
      .redirect(
        `/error.html?status=${statusCode}&message=${encodeURIComponent(
          message,
        )}`,
      );
  },
);

export default router;
