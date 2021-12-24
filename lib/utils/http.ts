import http, { RequestOptions } from 'http';
import configs from '../configs';

interface HttpHeaders {
  [key: string]: string | number;
}

namespace HttpUtils {
  export const post = (path: string, data: unknown, headers: HttpHeaders) => {
    const options: RequestOptions = {
      host: configs.RECEIVER.HOST,
      port: configs.RECEIVER.PORT,
      path,
      method: 'POST',
      headers,
    };
    const req = http.request(options);
    req.write(data);
    req.end();
  };
}

export default HttpUtils;
