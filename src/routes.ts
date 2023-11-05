import path from 'path';
import { Router } from 'express';
import {
  authorizer,
  login,
  register,
  logout,
  checkLoginStatus,
} from './authentication';
import {
  ValidationError,
  UnauthorizedError,
  SessionInitializationError,
  SessionDestructionError,
  NotFoundError,
} from './error/types';
import { NextFunction, Request, Response } from 'express';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);
router.get('/login-status', checkLoginStatus);

router.get('/admin', authorizer, (req, res) => {
  res.send('Protected content');
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
    let statusCode: number;
    let message: string;

    if (err instanceof UnauthorizedError) {
      statusCode = err.statusCode;
      message = err.message;
    } else if (err instanceof NotFoundError) {
      statusCode = err.statusCode;
      message = err.message;
    } else if (err instanceof ValidationError) {
      statusCode = err.statusCode;
      message = err.message;
    } else if (
      err instanceof SessionInitializationError ||
      err instanceof SessionDestructionError
    ) {
      statusCode = err.statusCode;
      message = err.message;
    } else {
      // Default to 500 Server Error
      statusCode = 500;
      message = 'Internal Server Error';
    }

    console.log('Error status code:', statusCode);
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
