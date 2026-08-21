import { getGTMNowString, } from 'manner.js/server';
import Outputable from '~/class/Outputable';
import checkMemory from '~/lib/checkMemory';

class Node extends Outputable {
  constructor(options) {
    super();
    this.startTime = Date.now();
    this.options = options;
    this.rate = 0;
    this.count = 0n;
  }

  getDutyCycle() {
    const {
      count,
      startTime,
    } = this;
    const nowTime = Date.now();
    const nowTimeBigInt = BigInt(nowTime);
    const startTimeBigInt = BigInt(startTime);
    if (nowTimeBigInt - startTimeBigInt === 0n) {
      return Infinity;
    } else {
      return (count * 1000n * 60n * 60n) / (nowTimeBigInt - startTimeBigInt);
    }
  }
};

export default Node;
