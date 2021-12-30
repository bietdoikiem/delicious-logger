import http from 'http';

namespace IPUtils {
  /**
   * Get public IPv4 of the current machine
   *
   * @returns Public IPv4
   */
  export const publicIPv4 = (): Promise<string> =>
    new Promise((resolve, reject) => {
      http.get({ host: 'api.ipify.org', port: 80, path: '/' }, (res) => {
        // Retrieve metadata of our request
        const { statusCode } = res;
        const contentType = res.headers['content-type'];
        let error;
        // Any 2xx status code signals a successful response but
        // here we're only checking for 200.
        if (statusCode !== 200) {
          // eslint-disable-next-line no-useless-concat
          error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
        } else if (!/^text\/plain/.test(contentType as string)) {
          error = new Error(
            'Invalid content-type.\n' +
              `Expected text/plain but received ${contentType}`
          );
        }
        if (error) {
          reject(error);
          res.resume();
          return;
        }
        res.on('data', (ip) => {
          resolve(ip.toString());
        });
      });
    });
}

export default IPUtils;
