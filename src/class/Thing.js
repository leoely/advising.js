import fs from 'fs';
import path from 'path';
import getDateString from '~/lib/getDateString';
import checkLogPath from '~/lib/checkLogPath';

function getGTMDateString() {
  return new Date().toString();
}

class Thing {
  constructor(url, content, options) {
    this.count = 0;
    this.rate = 0;
    this.url = url;
    this.content = content;
    this.options = options;
    this.interval = 0;
    const { logPath, } = this.options;
    checkLogPath(logPath);
  }

  writeLog(logPath, logLevel) {
    const { url, } = this;
    const dateString = getDateString();
    switch (logLevel) {
      case 1:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMDateString() + ' ||  ████ Location:'+ url + ' ████ & ████ RATE:' + this.rate + ' ████ || \n'
        );
        break;
      case 2:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMDateString() + ' ||  ████ Location:'+ url + ' ████ & ████ COUNT:' + this.count + ' ████ ||\n'
        );
        break;
      case 3:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMDateString() + ' || ████ Location:'+ url + ' ████ & ████ COUNT:' + this.count + ' ████ & ████ RATE:' + this.rate + ' ████ ||\n'
        );
        break;
      default:
        throw new Error('[Error] LogLevel must in set {1, 2, 3}.');
    }
  }

  match(total) {
    this.count += 1
    const { count, } = this;
    this.rate = count / total;
    const { logLevel, logInterval, logPath, } = this.options;
    this.interval += 1;
    const { interval, } = this;
    if (interval === logInterval) {
      this.interval = 0;
      this.writeLog(logPath, logLevel);
    }
  }

  getContent() {
    return this.content;
  }
}

export default Thing;
