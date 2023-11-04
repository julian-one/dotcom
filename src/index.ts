import path from 'path';
import express from 'express';
import session from 'express-session';
import env from './env';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(
  session({
    secret: env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

app.use(routes);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(env.PORT, () => {
  console.log(`[server] running on port: ${env.PORT}`);
});
