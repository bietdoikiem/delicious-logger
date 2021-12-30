/* eslint-disable no-useless-escape */
import { execSync } from 'child_process';
import http, { RequestOptions } from 'http';
import configs from '../configs';
import { HTTPObjectType } from '../types/payload';
import ObjectUtils from './object';

namespace HttpUtils {
  /**
   * Send a POST Request to the given host
   *
   * @param path Path/endpoint of given host
   * @param data Request body (Data)
   * @param headers Headers of the request
   */
  export const post = (
    path: string,
    data: HTTPObjectType,
    headers: HTTPObjectType = {}
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

  /**
   * Create POST request with JSON data type
   *
   * @param path Path/Endpoint
   * @param data Request body in JSON
   * @param headers Headers of the request
   */
  export const postJSON = (
    path: string,
    data: HTTPObjectType,
    headers: HTTPObjectType = {}
  ) => {
    const parseHeaders = {
      ...headers,
      'Content-Type': 'application/json',
    };
    post(path, data, parseHeaders);
  };

  /**
   * Perform HTTP Post request via shell process (CURL)
   *
   * @param path Path/Endpoint
   * @param data Request body (Data)
   * @param headers Headers of the request
   */
  export const postShellJSON = (
    path: string,
    data: { [key: string]: string | number },
    headers: HTTPObjectType = {}
  ) => {
    // Preprocess data
    const JSONData = JSON.stringify(data).replace(/"/g, '\\"');
    // Preprocess HTTP Headers
    // Init default application/json Content-Type
    const headerList = !ObjectUtils.isEmptyObject(headers)
      ? Object.entries(headers).map(([key, value]) => `-H "${key}: ${value}"`)
      : [];
    execSync(
      `curl -s -X POST "http://localhost:3001${path}" -H "Content-Type: application/json" ${headerList.join(
        ' '
      )} -d "${JSONData}"`,
      { stdio: 'pipe' }
    );
  };

  /**
   * Perform HTTP Delete request via shell process (CURL), customized by query Params
   *
   * @param path Path/Endpoint
   * @param vars Request query variables
   * @param headers Headers of the request
   */
  export const deleteShellJSON = (
    path: string,
    queryParams: { [key: string]: string | number } = {}
  ) => {
    // Preprocess --data-urlencode
    const queryList = !ObjectUtils.isEmptyObject(queryParams)
      ? Object.entries(queryParams).map(
          ([key, value]) => `--data-urlencode "${key}=${value}"`
        )
      : [];
    execSync(
      `curl -s -X DELETE -G "http://localhost:3001${path}" ${queryList.join(
        ' '
      )}`,
      {
        stdio: 'pipe',
      }
    );
  };
}

export default HttpUtils;
