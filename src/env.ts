import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.ENV}` });

function getEnvString(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`${key} environment variable not set`);
  }
  return value;
}

function getEnvNumber(key: string): number {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`${key} environment variable not set`);
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`${key} environment variable must be a number`);
  }
  return parsed;
}

const env = {
  PORT: getEnvNumber('PORT'),
  SECRET: getEnvString('SECRET'),
  DB_USER: getEnvString('DB_USER'),
  DB_HOST: getEnvString('DB_HOST'),
  DB_NAME: getEnvString('DB_NAME'),
  DB_PASSWORD: getEnvString('DB_PASSWORD'),
  DB_PORT: getEnvNumber('DB_PORT'),
};

export default env;
