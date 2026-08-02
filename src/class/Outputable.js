import {
  addToLog,
  appendToLog,
  getGTMNowString,
} from 'manner.js/server';
import checkMemory from '~/lib/checkMemory';
import Fulmination from 'fulmination';

class Outputable {
  constructor() {
    this.fulmination = new Fulmination();
  }

  static globalHash = {};

  static notice = {};

  setGlobal(global) {
    const {
      constructor: {
        name,
      },
    } = this;
    switch (name) {
      case 'DistribRouter':
      case 'WebDistribRouter': {
        const { address, } = this;
        Outputable.globalHash[address] = global;
        break;
      }
      default:
        throw new Error('[Error] Only distributed instances can set global object.');
    }
    this.checkMemory();
  }

  getGlobal() {
    const {
      constructor: {
        name,
      },
    } = this;
    switch (name) {
      case 'DistribRouter':
      case 'WebDistribRouter': {
        const { address, } = this;
        return Outputable.globalHash[address];
      }
      default:
        return undefined;
    }
  }

  addSystemNotice(phrase, callback) {
    if (typeof phrase !== 'string') {
      throw new Error('[Error] The parameter phase should be a string type.');
    }
    if (typeof callback !== 'function') {
      throw new Error('[Error] The parameter callback should be a function type.');
    }
    switch (phrase) {
      case 'mem>chk': {
        const { notice, } = Outputable;
        notice[phrase] = callback;
        break;
      }
      case 'freq>call': {
        const {
          constructor: {
            name,
          },
        } = this;
        switch (name) {
          case 'WebRouter':
          case 'WebDistribRouter': {
            const { notice, } = Outputable;
            notice[phrase] = callback;
            break;
          }
          default:
            throw new Error('[Error] The frequent call phrase is limited to WebRouter and WebDistribRouter.');
        }
        break;
      }
      default:
        throw new Error('[Error] The current system notification phrase does not exist.');
    }
    this.checkMemory();
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
    } = this;
    const { notice, } = Outputable;
    const global = this.getGlobal();
    return checkMemory(logPath, safeMemoryCapacity, value, this, temporaryMemorySwitch, notice['mem>chk'], global);
  }
}

export default Outputable;
