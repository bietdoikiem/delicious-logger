import { Request } from 'express';
import ILogger from './ILogger';

export default abstract class Logger implements ILogger {
  protected maxFileSize: number;
  protected dateFormat: string;
  protected filename: string;
  protected separator: string;

  constructor(
    filename: string,
    maxFileSize: number = -1,
    dateFormat: string = 'yyyy-MM-dd',
    separator: string = ''
  ) {
    this.maxFileSize = maxFileSize;
    this.dateFormat = dateFormat;
    this.filename = filename;
    this.separator = separator;
  }

  abstract log(req: Request): void;

  abstract stash(req: Request): void;

  abstract buildLog(req: Request): string;

  parseReq(req: Request, isFull: boolean = false) {
    const data = !isFull
      ? {
          body: req.body,
          query: req.query,
          headers: req.headers,
        }
      : req;
    return data;
  }
}
