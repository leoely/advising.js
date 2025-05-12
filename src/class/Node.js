import Outputable from '~/class/Outputable';
import appendToLog from '~/lib/appendToLog';
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
