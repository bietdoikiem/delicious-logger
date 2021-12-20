import express, { Request, Response } from 'express';
import deliciousLogger from '../../lib/index';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  deliciousLogger({
    layout: 'base',
    filename: 'request.log',
  })
);

app.get('/health-check', (_req: Request, res: Response) => {
  return res.status(200).json({
    message: `App is running well at port ${process.env.PORT}`,
  });
});

app.post('/accounts/create', (req: Request, res: Response) => {
  const { email, password } = req.body;
  return res.status(200).json({
    message: `SUCCESS! Account ${email} has been created`,
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Victim server!');
});

app.listen(Number(process.env.PORT), () => {
  console.log(`Victim Application is running at port ${process.env.PORT}`);
});
