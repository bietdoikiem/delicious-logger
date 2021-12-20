import fs from 'fs';

const fsp = fs.promises;

namespace FileUtils {
  export const append = async (file: string, data: string) => {
    await fsp.writeFile(file, data, {
      flag: 'a+',
    });
  };
}

export default FileUtils;
