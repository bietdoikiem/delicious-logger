import { Request } from 'express';
import { Color, colorize } from '../utils/color';
import FileUtils from '../utils/file';
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
   * Store the request log inside a log file
   */
  async stash(req: Request) {
    // CASE 1: Rollup disabled
    if (!this.rollup) {
      // Save to the log file
      FileUtils.append(
        this.filename,
        JSON.stringify(this.buildLog(req)) + this.separator
      );
      return;
    }
    // CASE 2: Rollup enabled
    const shouldRoll = this.rollup.shouldRoll();
    if (shouldRoll) {
      // Rollup and init new one
      this.rollup.roll();
    }
    const filename = this.rollup.getCurrentRoll();
    FileUtils.append(filename, this.buildLog(req) + this.separator);
    return;
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
