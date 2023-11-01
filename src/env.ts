import dotenv from 'dotenv';
dotenv.config();

const PORT_STR = process.env.PORT;
const HOST = process.env.HOST;

if (!PORT_STR) throw new Error('PORT environment variable not set');
const PORT = parseInt(PORT_STR, 10);
if (isNaN(PORT)) throw new Error('PORT environment variable must be a number');

if (!HOST) throw new Error('HOST environment variable not set');

const env = {
  PORT,
  HOST,
};

export default env;
