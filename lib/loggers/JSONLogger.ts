import { Request } from 'express';
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
   * Build log string with Request object of Express
   *
   * @returns Log string
   */
  buildLog(req: Request): string {
    const logObj = {
      datetime: new Date().toLocaleString(),
      method: req.method,
      url: req.url,
      data: this.parseReq(req),
    };
    return JSON.stringify(logObj);
  }
}
