const fs = require('fs');
const path = require('path');

module.exports = {
  getCurrentDirectoryBase: () => {
    // process.cwd() 返回当前进程的工作目录，process.chdir(directory)则改变进程的工作目录，如果改变失败将抛出一个异常。
    return path.basename(process.cwd());
  },

  directoryExists: (filepath) => {
    try {
      return fs.statSync(filepath).isDirectory();
    } catch (e) {
      return false;
    }
  }
};