import Outputable from '~/class/Outputable';
import checkMemory from '~/lib/checkMemory';
import getGTMNowString from '~/lib/getGTMNowString';

class Node extends Outputable {
  constructor(options) {
    super();
    this.startTime = Date.now();
    this.options = options;
    this.rate = 0;
    this.count = 0;
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

  getDutyCycle() {
    const {
      count,
      startTime,
    } = this;
    const now = Date.now();
    return count * 1000 * 60 * 60 / (now - startTime);
  }
};

export default Node;
