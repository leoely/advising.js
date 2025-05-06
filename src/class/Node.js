import fs from 'fs';
import path from 'path';
import getDateString from '~/lib/getDateString';

class Node {
  constructor(options) {
    this.options = options;
    this.rate = 0;
    this.count = 0;
  }

  getDutyCycle() {
    const {
      count,
      options: {
        startTime,
      },
    } = this;
    const now = Date.now();
    return count / ((now - startTime) / 1000 * 60 * 60);
  }

  appendToLog(content) {
    const {
      options: {
        logPath,
      },
    } = this;
    const dateString = getDateString();
    fs.appendFileSync(path.join(logPath, dateString), content);
  }
};

export default Node;
