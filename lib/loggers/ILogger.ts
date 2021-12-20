import { Request } from 'express';

export default interface ILogger {
  log: (req: Request) => void;
  stash: (req: Request) => void;
}
