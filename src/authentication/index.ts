import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import Database from '../database';
import { UserRecord } from '../database/types';
import { Login, Registration, toUser } from './types';
import {
  SessionDestructionError,
  SessionInitializationError,
  UnauthorizedError,
  ValidationError,
} from '../error/types';
import { isValidRegistration } from './validations';
import Session from './session';

const database: Database = Database.getInstance();

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const login: Login = { username, password };

  try {
    const userRecord = await database.getUserByUsername(username);
    const user = toUser(userRecord);

    if (user && (await bcrypt.compare(password, user.password))) {
      await Session.initialize(req, user.id);
      res.status(200).send('logged in successfully');
    } else {
      res.status(401).send('invalid username or password');
    }
  } catch (error) {
    console.error(error);
    if (error instanceof SessionInitializationError) {
      res.status(500).send(error.message);
    } else {
      console.error(error);
      res.status(500).send('something went wrong logging in');
    }
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const registration: Registration = { username, email, password };

  try {
    await isValidRegistration(database, registration);
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRecord = await database.createUser(
      username,
      email,
      hashedPassword,
    );
    const user = toUser(userRecord);
    await Session.initialize(req, user.id);
    res.status(201).json({ message: 'Registered successfully' });
  } catch (error) {
    console.error(error);
    if (error instanceof ValidationError) {
      res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof SessionInitializationError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: 'Something went wrong registering user' });
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await Session.destroy(req, res);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    if (error instanceof SessionDestructionError) {
      res.status(error.statusCode).send(error.message);
    } else {
      res.status(500).send('something went wrong logging out');
    }
  }
};

export const checkLoginStatus = async (req: Request, res: Response) => {
  const userId: number | undefined = req.session.userId;
  const isLoggedIn = userId !== undefined;

  let username = null;
  if (isLoggedIn) {
    const userRecord: UserRecord = await database.getUserById(userId);
    username = userRecord.username;
  }
  res.json({ isLoggedIn, username });
};

export const authorizer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    next(new UnauthorizedError('you are not authenticated'));
  } else {
    next();
  }
};
