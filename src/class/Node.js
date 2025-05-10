import appendToLog from '~/lib/appendToLog';
import checkMemory from '~/lib/checkMemory';

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
    appendToLog(logPath, content);
  }

  checkMemory(value) {
    const {
      options: {
        logPath,
      },
    } = this;
    checkMemory(logPath, value);
  }
};

export default Node;
