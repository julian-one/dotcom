import dotenv from 'dotenv';
dotenv.config();

const PORT_STR = process.env.PORT;
const HOST = process.env.HOST;
const SECRET = process.env.SECRET;

const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT_STR = process.env.DB_PORT;

if (!PORT_STR) throw new Error('PORT environment variable not set');
const PORT = parseInt(PORT_STR, 10);
if (isNaN(PORT)) throw new Error('PORT environment variable must be a number');
if (!HOST) throw new Error('HOST environment variable not set');
if (!SECRET) throw new Error('SECRET environment variable not set');

if (!DB_USER) throw new Error('DB_USER environment variable not set');
if (!DB_HOST) throw new Error('DB_HOST environment variable not set');
if (!DB_NAME) throw new Error('DB_NAME environment variable not set');
if (!DB_PASSWORD) throw new Error('DB_PASSWORD environment variable not set');

if (!DB_PORT_STR) throw new Error('PORT environment variable not set');
const DB_PORT = parseInt(DB_PORT_STR, 10);
if (isNaN(DB_PORT)) throw new Error('DB_PORT environment variable must be a number');


const env = {
  PORT,
  HOST,
  SECRET,
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT
};

export default env;
