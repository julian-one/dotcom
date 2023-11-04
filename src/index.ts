import express, { Request, Response } from 'express';
import path from 'path';
import env from './env';
import Database from './database';
import bcrypt from 'bcrypt';
import session from 'express-session';
import { toUser } from './authentication/types';

const app = express();

app.use(express.json());
app.use(
  session({
    secret: env.SECRET,
    resave: false,
    saveUninitialized: false, // Don't create a session until something is stored
    cookie: { secure: false }, // Set secure to true if you're using HTTPS
  }),
);

const database = Database.getInstance();

const auth = (req: Request, res: Response, next: Function) => {
  if (!req.session.userId) {
    console.log(`no user id for session: ${req.session}`);
    return res.status(401).send('You are not authenticated');
  }
  next();
};

app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const userRecord = await database.getUserByUsername(username);
    const user = toUser(userRecord);

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).send('Error regenerating session');
        }
        req.session.userId = user.id;
        res.status(200).send('Logged in successfully');
      });
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});

app.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await database.userExists(username, email);
    if (userExists) {
      return res.status(409).send('User already exists.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const dbNewUser = await database.createUser(
      username,
      email,
      hashedPassword,
    );
    const newUser = toUser(dbNewUser);

    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).send('Error regenerating session');
      }
      req.session.userId = newUser.id;
      res.status(201).send('User registered successfully.');
    });
  } catch (error) {
    console.error('Error registering new user:', error);
    res.status(500).send('Error registering new user.');
  }
});

app.get('/protected', auth, (req: Request, res: Response) => {
  res.send('Protected content');
});

app.get('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during session destruction:', err);
      return res.status(500).send('Error logging out');
    }
    res.clearCookie('connect.sid'); // The name of the cookie to clear
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
