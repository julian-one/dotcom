import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import Database from '../database';
import { toUser } from './types';

const database = Database.getInstance();

export const authorizer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    console.log(`unauthorized session: ${req.session}`);
    return res.status(401).send('You are not authenticated');
  }
  next();
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
