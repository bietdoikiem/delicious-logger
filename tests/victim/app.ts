import express, { Request, Response } from 'express';
import deliciousLogger from '../../lib/index';

const app = express();

const baseDir = __dirname;

/* * Global Middlewares * */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  deliciousLogger({
    layout: 'basic',
    filename: `${baseDir}/logs/requests.log`,
    maxFileSize: 6000, // NOTE: 6 KB
  })
);

/**
 * Health check endpoint
 */
// eslint-disable-next-line arrow-body-style
app.get('/health-check', (_req: Request, res: Response) => {
  return res.status(200).json({
    message: `App is running well at port ${process.env.PORT}`,
  });
});

/**
 * Mock endpoint to create account with credentials included
 */
app.post('/accounts/create', (req: Request, res: Response) => {
  const { email, password } = req.body;
  return res.status(200).json({
    message: `SUCCESS! Account ${email} has been created`,
  });
});

/**
 * Index endpoint
 */
app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Victim server!');
});

// Run node server
app.listen(Number(process.env.PORT), () => {
  // eslint-disable-next-line no-console
  console.log(`Victim Application is running at port ${process.env.PORT}`);
});
