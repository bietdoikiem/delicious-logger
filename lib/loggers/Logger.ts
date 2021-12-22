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

  /**
   * IMPLEMENTATION
   * Store the request inside the log file
   *
   * @param req Express Request object
   */
  stash(req: Request): void {
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
  }

  abstract buildLog(req: Request): string;

  /**
   * IMPLEMENTATION
   * Parse Express Request object
   *
   * @param req Request
   * @param isFull Parse fully including all properties of Express Object (Not recommend)
   * @returns Request object
   */
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
