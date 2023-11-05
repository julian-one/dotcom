import Filter from 'bad-words';
import validator from 'validator';

const filter = new Filter();

const isUsernameValid = (username: string): boolean => {
  const usernameParts = username.split(/\s+/);
  for (const part of usernameParts) {
    if (filter.isProfane(part)) {
      return false;
    }
  }
  if (validator.contains(username, ' ')) {
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

export { isUsernameValid, isEmailValid, isPasswordStrong };
