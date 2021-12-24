import SizeRollUp from '../rollups/SizeRollUp';
import { LoggerOptions } from '../types/options';
import BasicLogger from './BasicLogger';
import JSONLogger from './JSONLogger';
import Logger from './Logger';

export default class LoggerFactory {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getLogger({
    layout,
    filename,
    separator,
    maxFileSize,
  }: LoggerOptions): Logger {
    // Init roll (if size option is specified)
    let rollup = null;
    if (typeof maxFileSize !== 'undefined') {
      rollup = new SizeRollUp(filename, maxFileSize);
    }
    // Produce different loggers based on the specified layout
    if (layout === 'basic') {
      // Init roll up
      return new BasicLogger(filename, separator, rollup);
    }

    if (layout === 'json') {
      return new JSONLogger(filename, separator, rollup);
    }
    throw new Error('LOGGER ERROR! Invalid layout option for logger!');
  }
}
