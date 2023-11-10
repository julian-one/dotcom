import bcrypt from 'bcrypt';
import { Login, Registration } from './types';
import { toUser } from '../users/types';
import Session from './session';
import Database from '../database';
import { isValidRegistration } from './validations';
import { UnauthorizedError } from '../error/types';
import { asyncHandler } from '../handler';

const database: Database = Database.getInstance();

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const login: Login = { username, password };

  const userRecord = await database.getUserByUsername(login.username);
  const user = toUser(userRecord);

  if (user && (await bcrypt.compare(login.password, user.password))) {
    await Session.initialize(req, user.id);
    res.status(200).json({ message: 'Logged in successfully' });
  } else {
    throw new UnauthorizedError('Invalid username or password');
  }
});

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const registration: Registration = { username, email, password };

  await isValidRegistration(database, registration);
  const hashedPassword = await bcrypt.hash(password, 10);
  const userRecord = await database.createUser(username, email, hashedPassword);
  const user = toUser(userRecord);
  await Session.initialize(req, user.id);
  res.status(201).json({ message: 'Registered successfully' });
});

export const logout = asyncHandler(async (req, res) => {
  await Session.destroy(req, res);
  res.status(200).json({ message: 'Logged out successfully' });
});

export const loginStatus = asyncHandler(async (req, res) => {
  console.log(` -------- loginStatus 000 -------- `)
  if (!req.session || !req.session.userId) {
    console.log(` -------- loginStatus 000 -------- `, req.session, JSON.stringify(req.session))
    return res.status(200).json({ loggedIn: false });
  }
  console.log(` -------- loginStatus 001 -------- `, req.session, JSON.stringify(req.session))

  try {
    const userRecord = await database.getUserById(req.session.userId);
    console.log(` -------- loginStatus 002 -------- `, userRecord, JSON.stringify(userRecord))
    if (!userRecord) {
      return res.status(200).json({ loggedIn: false });
    }
    const user = toUser(userRecord);
    return res.status(200).json({
      isLoggedIn: true,
      username: user.username,
    });
  } catch (error) {
    console.log(` -------- loginStatus 003 -------- YIKES`)
    return res.status(200).json({ loggedIn: false });
  }
});
