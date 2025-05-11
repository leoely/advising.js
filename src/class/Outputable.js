import Fulmination from 'fulmination';
import appendToLog from '~/lib/appendToLog';
import checkMemory from '~/lib/checkMemory';

const fulmination = new Fulmination();

class Outputable {
  constructor() {
    this.fulmination = fulmination;
  }

  debug(info) {
    const {
      options: {
        debug,
      },
      fulmination,
    } = this;
    if (debug === true) {
      fulmination.scan(info);
    }
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
    return checkMemory(logPath, value);
  }
}

export default Outputable;
