import { Request } from 'express';

namespace RequestUtils {
  /**
   * Check if the current server is hosted at local
   *
   * @param req Request object of Express
   * @returns True if localhost || False if not
   */
  export const isLocal = (req: Request) => req.hostname === 'localhost';

  /**
   * Get the current port of the server's host
   *
   * @param req Request object of express
   * @returns True if localhost || False if not
   */
  export const getPort = (req: Request) =>
    parseInt(req.get('host')?.split(':')[1] as string, 10);

  export const getHostURL = (req: Request) =>
    `${req.protocol}://${req.get('host')}`;
}

export default RequestUtils;
