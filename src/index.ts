import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('hello world');
});

app.listen(PORT, () => {
    console.log(`[server] running on port: ${PORT}`);
});
