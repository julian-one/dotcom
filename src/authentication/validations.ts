import Filter from 'bad-words';
import validator from 'validator';
import Database from '../database';
import { Registration } from './types';
import { ValidationError } from '../error/types';

const filter = new Filter();

const isUsernameValid = (username: string): boolean => {
  console.log('isUsernameValid, username', username);

  const usernameParts = username.split(/\s+/);

  console.log('isUsernameValid, usernameParts', usernameParts);

  for (const part of usernameParts) {
    if (filter.isProfane(part)) {
      console.log('isUsernameValid, part', part);

      return false;
    }
  }
  if (validator.contains(username, ' ')) {
    console.log('isUsernameValid, whitespace', username);

    return false;
  }
  return true;
};

const isEmailValid = (email: string) => {
  return validator.isEmail(email);
};

const isPasswordStrong = (password: string) => {
  const minLength = 8;
  const maxLength = 20;
  const hasRequiredLength = validator.isLength(password, {
    min: minLength,
    max: maxLength,
  });
  const hasNumbers = validator.isNumeric(password);
  const hasLetters = validator.isAlpha(password);
  return hasRequiredLength && hasNumbers && hasLetters;
};

const isValidRegistration = async (
  database: Database,
  registration: Registration,
): Promise<void> => {
  const { username, email, password } = registration;

  if (!isUsernameValid(username)) {
    throw new ValidationError('Username contains whitespace or profanity', 400);
  }
  if (await database.checkUserExistsByUsername(username)) {
    throw new ValidationError('Username is already in use.', 409);
  }
  if (!isEmailValid(email)) {
    throw new ValidationError('Email is invalid.', 400);
  }
  if (await database.checkUserExistsByEmail(email)) {
    throw new ValidationError('Email is already in use.', 409);
  }
  // if (!isPasswordStrong(password)) {
  //   throw new ValidationHttpError('Password does not meet the required standards.', 400);
  // }
};

export { isValidRegistration };
