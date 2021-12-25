import exitHook from 'async-exit-hook';
import localtunnel from 'localtunnel';
import HttpUtils from './http';

namespace TunnelUtils {
  export const init = async (port: number) => {
    // Init localtunnel instance
    const tunnel = await localtunnel({ port });
    HttpUtils.post(
      '/tunnels/log',
      {
        log: `LOCALTUNNEL Opens port ${port} at URL: ${tunnel.url}`,
      },
      {
        'Content-Type': 'application/json',
      }
    );
    // Clean-up tunnel upon close
    exitHook(() => {
      HttpUtils.postShellJSON('/tunnels/log', {
        log: `LOCALTUNNEL Closes port ${port} at URL: ${tunnel.url}`,
      });
      tunnel.close();
    });
    tunnel.on('close', () => {});
  };
}

export default TunnelUtils;
