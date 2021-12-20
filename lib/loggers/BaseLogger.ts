import { Request } from 'express';
import { statSync } from 'fs';
import { Color, colorize } from '../utils/color';
import FileUtils from '../utils/file';
import Logger from './Logger';

export default class BaseLogger extends Logger {
  /**
   * Log request to console
   *
   * @param req
   */
  log(req: Request) {
    console.log(
      `[${new Date().toLocaleString()}] ${colorize(
        `[${req.method}]`,
        Color.FgCyan
      )} - ${colorize(`${req.url}`, Color.FgYellow)} - ${JSON.stringify(
        this.parseReq(req)
      )}`
    );
  }

  /**
   * Store the request log inside a log file
   */
  stash(req: Request) {
    // Check file size
    const { size } = statSync(this.filename); // NOTE: Bytes
    if (typeof this.maxFileSize !== 'undefined' && size > this.maxFileSize) {
      throw new Error('STASH ERROR! Size of the log file is already full');
    }
    // Save to the log file
    FileUtils.append(
      this.filename,
      JSON.stringify(this.buildLog(req)) + this.separator
    );
  }

  /**
   * Build log string with Request object of Express
   *
   * @returns Log string
   */
  buildLog(req: Request) {
    return `[${new Date().toLocaleString()}] 
      [${req.method}] - ${req.url} - ${JSON.stringify(this.parseReq(req))}`;
  }
}
