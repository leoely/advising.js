import appendToLog from '~/lib/appendToLog';
import checkMemory from '~/lib/checkMemory';
import getGTMNowString from '~/lib/getGTMNowString';
import fulmination from '~/obj/fulmination';

class Outputable {
  constructor() {
    this.fulmination = fulmination;
  }

  appendToLog(content) {
    const {
      options: {
        logPath,
        logLevel,
      },
    } = this;
    if (logLevel !== 0) {
      appendToLog(logPath, content);
    }
  }

  checkMemory(value) {
    const {
      options: {
        logPath,
      },
    } = this;
    return checkMemory(logPath, value);
  }
}

export default Outputable;
