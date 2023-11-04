import path from 'path';
import express from 'express';
import session from 'express-session';
import env from './env';
import routes from './routes';
import Database from './database';
import connectPgSimple from 'connect-pg-simple';

const app = express();

const PgSession = connectPgSimple(session);
const db = Database.getInstance();

app.use(express.json());
app.use(
  session({
    store: new PgSession({
      pool: db.getPool(),
      tableName: 'sessions',
    }),
    secret: env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true },
  }),
);

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.listen(env.PORT, () => {
  console.log(`[server] running on port: ${env.PORT}`);
});
