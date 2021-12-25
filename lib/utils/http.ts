/* eslint-disable no-useless-escape */
import { execSync } from 'child_process';
import http, { RequestOptions } from 'http';
import configs from '../configs';

interface HttpHeaders {
  [key: string]: string | number;
}

namespace HttpUtils {
  export const post = (
    path: string,
    data: { [key: string]: string | number },
    headers: HttpHeaders
  ) => {
    const options: RequestOptions = {
      host: configs.RECEIVER.HOST,
      port: configs.RECEIVER.PORT,
      path,
      method: 'POST',
      headers,
    };
    const req = http.request(options);
    req.write(JSON.stringify(data));
    req.end();
  };

  export const postShellJSON = (
    path: string,
    data: { [key: string]: string | number },
    headers?: HttpHeaders
  ) => {
    // Preprocess data
    const JSONData = JSON.stringify(data).replaceAll('"', '\\"');
    // Preprocess HTTP Headers
    // Init default application/json Content-Type
    const headerList =
      typeof headers !== 'undefined'
        ? Object.entries(headers).map(([key, value]) => `-H "${key}: ${value}"`)
        : null;
    execSync(
      `curl -s -X POST "http://localhost:3001${path}" -H "Content-Type: application/json" ${
        headerList !== null ? headerList.join(' ') : ''
      } -d "${JSONData}"`,
      { stdio: 'pipe' }
    );
  };
}

export default HttpUtils;
