import path from 'path';
import { Router } from 'express';
import { authorizer, login, register, logout, checkLoginStatus } from './authentication';

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

export default router;
