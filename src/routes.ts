import path from 'path';
import { Router } from 'express';
import { authorizer, login, register, logout } from './authentication';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);

router.get('/protected', authorizer, (req, res) => {
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