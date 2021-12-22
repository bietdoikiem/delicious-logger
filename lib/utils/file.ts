import fs from 'fs';
import glob from 'glob';
import path from 'path';

const fsp = fs.promises;

namespace FileUtils {
  /**
   * Append new line to the file
   *
   * @param file File to be appended
   * @param data Data to write/append
   */
  export const append = async (file: string, data: string) => {
    await fsp.writeFile(file, data, {
      flag: 'a+',
    });
  };

  /**
   * Check if file exists in the system
   *
   * @param file
   * @returns True if exists || False if NOT
   */
  export const exists = (file: string) => {
    return fs.existsSync(file);
  };

  /**
   * Find all files by given name
   *
   * @param filename File's name
   * @returns File names (Promise)
   */
  export const findAllByName = (filename: string): Promise<string[]> =>
    new Promise((resolve, reject) => {
      // Match all files with given filename
      glob(`${filename}*`, (err, foundFiles) => {
        if (err) {
          reject(err);
        }
        resolve(foundFiles);
      });
    });

  /**
   * Convert absolute path to relative one, in relative to CWD
   *
   * @param file Filename, File's path, etc.
   * @returns Relative path
   */
  export const absoluteToRelative = (file: string) =>
    path.relative(process.cwd(), file);
}

export default FileUtils;
