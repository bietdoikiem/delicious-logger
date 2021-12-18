import express, { Request, Response } from 'express';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/health-check', (_req: Request, res: Response) => {
  return res.status(200).json({
    message: `App is running well at port ${process.env.PORT}`,
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to our the Hacker1337 server!');
});

app.listen(Number(process.env.PORT), () => {
  console.log(`Receiver Application is running at port ${process.env.PORT}`);
});
