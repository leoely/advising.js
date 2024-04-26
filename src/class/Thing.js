import fs from 'fs';
import path from 'path';
import getDateString from '~/lib/getDateString';
import checkLogPath from '~/lib/checkLogPath';

class Thing {
  constructor(url, thing, options) {
    this.count = 0;
    this.rate = 0;
    this.url = url;
    this.thing = thing;
    this.options = options;
    this.interval = 0;
    const { logPath, } = this.options;
    checkLogPath(logPath);
  }

  checkLogPath() {
    const { logPath, } = this.options;
    if (!fs.existsSync(logPath)) {
      fs.mkdirSync(logPath);
    }
  }

  writeLog(logPath, logLevel) {
    const { url, } = this;
    const dateString = getDateString();
    switch (logLevel) {
      case 1:
        fs.appendFileSync(
          path.join(logPath, dateString),
          '@['+ url + '] rate: |' + this.rate + '|;\n'
        );
        break;
      case 2:
        fs.appendFileSync(
          path.join(logPath, dateString),
          '@['+ url + '] count: |' + this.count + '|;\n'
        );
        break;
      case 3:
        console.log(1);
        fs.appendFileSync(
          path.join(logPath, dateString),
          '@['+ url + '] count:|' + this.count + '| & rate:|' + this.rate + '|;\n'
        );
        break;
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
}

export default Thing;
