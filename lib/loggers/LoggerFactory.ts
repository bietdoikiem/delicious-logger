import { LoggerOptions } from '../types/options';
import BaseLogger from './BaseLogger';
import JSONLogger from './JSONLogger';
import Logger from './Logger';

export default class LoggerFactory {
  public getLogger(opts: LoggerOptions): Logger {
    const { layout, filename, separator, dateFormat, maxFileSize } = opts;
    if (layout === 'base') {
      return new BaseLogger(filename, maxFileSize, dateFormat, separator);
    } else if (layout == 'json') {
      return new JSONLogger(filename, maxFileSize, dateFormat, separator);
    }
    throw new Error('LOGGER ERROR! Invalid layout option for logger!');
  }
}
