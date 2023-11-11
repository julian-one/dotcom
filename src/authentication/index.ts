import bcrypt from 'bcrypt';
import { Login, Registration } from './types';
import { toUser } from '../users/types';
import Session from './session';
import Database from '../database';
import { isValidRegistration } from './validations';
import { UnauthorizedError } from '../error/types';
import { asyncHandler } from '../handler';

const database: Database = Database.getInstance();

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const login: Login = { username, password };

  const userRecord = await database.getUserByUsername(
    login.username.toLowerCase(),
  );
  const user = toUser(userRecord);

  if (
    user.username.toLowerCase() === login.username.toLowerCase() &&
    (await bcrypt.compare(login.password, user.password))
  ) {
    await Session.initialize(req, user.id);
    await database.updateUserLastLogin(user.id);
    res.status(200).json({ message: 'Logged in successfully' });
  } else {
    throw new UnauthorizedError('Invalid username or password');
  }
});

const register = asyncHandler(async (req, res) => {
  let { username, email, password } = req.body;
  username = username.toLowerCase();
  email = email.toLowerCase();

  const registration: Registration = { username, email, password };

  await isValidRegistration(database, registration);
  const hashedPassword = await bcrypt.hash(password, 10);
  const userRecord = await database.createUser(username, email, hashedPassword);
  const user = toUser(userRecord);
  await Session.initialize(req, user.id);
  res.status(201).json({ message: 'Registered successfully' });
});

const logout = asyncHandler(async (req, res) => {
  await Session.destroy(req, res);
  res.status(200).json({ message: 'Logged out successfully' });
});

const loginStatus = asyncHandler(async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(200).json({ loggedIn: false });
  }

  try {
    const userRecord = await database.getUserById(req.session.userId);
    if (!userRecord) {
      return res.status(200).json({ loggedIn: false });
    }
    const user = toUser(userRecord);
    return res.status(200).json({
      isLoggedIn: true,
      username: user.username,
    });
  } catch (error) {
    return res.status(200).json({ loggedIn: false });
  }
});

export { register, login, logout, loginStatus };
