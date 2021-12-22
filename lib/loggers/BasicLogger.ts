import { Request } from 'express';
import { Color, colorize } from '../utils/color';
import Logger from './Logger';

export default class BasicLogger extends Logger {
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
   * Build log string with Request object of Express
   *
   * @returns Log string
   */
  buildLog(req: Request) {
    return `[${new Date().toLocaleString()}] [${req.method}] - ${
      req.url
    } - ${JSON.stringify(this.parseReq(req))}`;
  }
}
