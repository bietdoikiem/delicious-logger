import express, { Request, Response } from 'express';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Check if server is running
 */
app.get('/health-check', (_req: Request, res: Response) => {
  return res.status(200).json({
    message: `App is running well at port ${process.env.PORT}`,
  });
});

/**
 * Receive payload of victim endpoint
 */
app.post('/', (req: Request, res: Response) => {
  console.log(req.body);
  return res.status(200).send();
});

app.post('/victims', (req: Request, res: Response) => {
  return res.status(200).send();
});

app.listen(Number(process.env.PORT), () => {
  console.log(`Receiver Application is running at port ${process.env.PORT}`);
});
