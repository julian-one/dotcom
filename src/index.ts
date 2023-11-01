import express, { Request, Response } from 'express';
import path from 'path';
import env from './env';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(env.PORT, () => {
  console.log(`[server] running on port: ${env.PORT}`);
});
