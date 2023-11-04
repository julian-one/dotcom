import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import Database from '../database';
import { toUser } from './types';
import { HttpError } from '../error/types';

const database = Database.getInstance();

export const authorizer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    console.log(`Unauthorized session: ${req.session}`);
    const err = new Error('You are not authenticated') as HttpError;
    err.status = 401;
    next(err);
  } else {
    next();
  }
};

export const login = async (req: Request, res: Response) => {
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
};

export const register = async (req: Request, res: Response) => {
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
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during session destruction:', err);
      return res.status(500).send('Error logging out');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};

export const checkLoginStatus = async (req: Request, res: Response) => {
  const userId = req.session.userId;
  const isLoggedIn = userId !== undefined;
  let username = null;

  if (isLoggedIn) {
    console.log('user is logged in userId:', userId);

    const userRecord = await database.getUserById(userId);
    username = userRecord ? userRecord.username : null;
  }

  res.json({ isLoggedIn, username });
};
