/* eslint-disable no-param-reassign */
namespace StringUtils {
  export const objectToQueryString = (queryParams: { [key: string]: any }) => {
    const reducer =
      (obj: { [key: string]: any }, parentPrefix: string | null = null) =>
      (prev: any[], key: string) => {
        const val = obj[key];
        key = encodeURIComponent(key);
        const prefix = parentPrefix ? `${parentPrefix}[${key}]` : key;

        if (val == null || typeof val === 'function') {
          prev.push(`${prefix}=`);
          return prev;
        }

        if (['number', 'boolean', 'string'].includes(typeof val)) {
          prev.push(`${prefix}=${encodeURIComponent(val)}`);
          return prev;
        }

        prev.push(Object.keys(val).reduce(reducer(val, prefix), []).join('&'));
        return prev;
      };

    return Object.keys(queryParams).reduce(reducer(queryParams), []).join('&');
  };
}

export default StringUtils;
