import { Request } from 'express';
import path from 'path';
import RollUp from '../rollups/RollUp';
import FileUtils from '../utils/file';
import ILogger from './ILogger';

export default abstract class Logger implements ILogger {
  protected maxFileSize: number;
  protected dateFormat: string; // NOTE: Currently unsupported
  protected filename: string;
  protected separator: string;
  protected rollup: RollUp | null;

  constructor(
    filename: string,
    separator: string = '\n', // NOTE: Default new line
    rollup: RollUp | null = null
  ) {
    this.filename = path.isAbsolute(filename)
      ? FileUtils.absoluteToRelative(filename)
      : filename;
    this.separator = separator;
    this.rollup = rollup;
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
