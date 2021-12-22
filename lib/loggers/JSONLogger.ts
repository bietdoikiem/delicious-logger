import { Request } from 'express';
import { statSync } from 'fs';
import FileUtils from '../utils/file';
import Logger from './Logger';

export default class JSONLogger extends Logger {
  /**
   * Log request to console
   *
   * @param req
   */
  log(req: Request) {
    console.log(`[${new Date().toLocaleString()}] - ${this.buildLog(req)}`);
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
    FileUtils.append(this.filename, this.buildLog(req) + this.separator);
  }

  /**
   * Build log string with Request object of Express
   *
   * @returns Log string
   */
  buildLog(req: Request): string {
    const logObj = {
      date: new Date().toLocaleString(),
      method: req.method,
      url: req.url,
      data: this.parseReq(req),
    };
    return JSON.stringify(logObj);
  }
}
