import {
  addToLog,
  appendToLog,
  getGTMNowString,
} from 'manner.js/server';
import checkMemory from '~/lib/checkMemory';
import Fulmination from 'fulmination';

const {
  fulmination,
} = global;

class Outputable {
  constructor() {
    this.fulmination = new Fulmination();
  }

  debugInfo(info) {
    const {
      options: {
        debug,
      },
      constructor: {
        name,
      },
    } = this;
    if (debug === true) {
      this.debugDetail(
        '(+) bold; green: * ^^ (+) blue; bold: * ' + name + '(+) bold; dim: * ' + info + '. &'
      );
    }
  }

  debugShort(short) {
    const {
      options: {
        debug,
      },
      fulmination,
    } = this;
    if (debug === true) {
      fulmination.scan(short);
    }
  }

  debugDetail(detail) {
    const {
      options: {
        debug,
      },
      fulmination,
    } = this;
    if (debug === true) {
      fulmination.scan(detail);
      console.log(getGTMNowString() + '\n');
    }
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

  addToLog(content) {
    const {
      options: {
        logPath,
        logLevel,
      },
    } = this;
    addToLog(logPath, content);
  }

  checkMemory(value) {
    const {
      options: {
        safeMemoryCapacity,
        logPath,
        temporaryMemorySwitch,
      },
      notice,
    } = this;
    return checkMemory(logPath, safeMemoryCapacity, value, this, temporaryMemorySwitch, notice['mem>chk']);
  }
}

export default Outputable;
