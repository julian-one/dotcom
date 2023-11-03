import express, { Request, Response } from 'express';
import path from 'path';
import env from './env';
import Database from './database';
import bcrypt from 'bcrypt';
import session from 'express-session';

const app = express();

app.use(express.json());
app.use(session({
  secret: 'some_sups_secret',
  resave: false,
  saveUninitialized: true,
}));

const database = Database.getInstance();

app.post('/register', async (req: Request, res: Response) => {
  console.log('register session:', req.session);

  const { username, email, password } = req.body;
  // to-do: server side validation

  try {
    const userExists = await database.userExists(username, email);
    if (userExists) {
      return res.status(409).send('User already exists.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await database.createUser(username, email, hashedPassword);

    res.status(201).send('User registered successfully.');
  } catch (error) {
    console.error('Error registering new user:', error);

    res.status(500).send('Error registering new user.');
  }
});

app.get('/protected', (req: Request, res: Response) => {
  console.log('protected session:', req.session);

  if (!req.session.id) {
    return res.status(401).send('You are not authenticated');
  }
  res.send('Protected content');
});

app.get('/logout', (req: Request, res: Response) => {
  console.log('logout session:', req.session);

  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
});

app.get('/register', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(env.PORT, () => {
  console.log(`[server] running on port: ${env.PORT}`);
});
