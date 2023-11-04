import path from 'path';
import { Router } from 'express';
import {
  authorizer,
  login,
  register,
  logout,
  checkLoginStatus,
} from './authentication';
import { HttpError } from './error/types';
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
  const err: HttpError = new Error('Not Found') as HttpError;
  err.status = 404;
  next(err);
});

router.use(
  (err: HttpError, _req: Request, res: Response, _next: NextFunction): void => {
    const statusCode = err.status || 500;
    console.log('statusCode:', statusCode);
    res.redirect(
      `/error.html?status=${statusCode}&message=${encodeURIComponent(
        err.message || 'Internal Server Error',
      )}`,
    );
  },
);

export default router;
