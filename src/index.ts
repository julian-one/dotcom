import path from 'path';
import express from 'express';
import routes from './routes';
import env from './env';
import Database from './database';
import Session from './authentication/session';

const app = express();
const db = Database.getInstance();

app.use(express.json());
app.use(Session.configure(db));

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.listen(env.PORT, () => {
  console.log(`[server] running on port: ${env.PORT}`);
});
