import fs from 'fs';
import path from 'path';
import getDateString from '~/lib/getDateString';

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
  }

  writeToLog(logPath, logLevel) {
    const { url, rate, count, dutyCycle, } = this;
    const dateString = getDateString();
    switch (logLevel) {
      case 1:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMDateString() + ' ||  ████ Location:'+ url + ' ████ & ████ RATE:' + rate + ' ████ || \n'
        );
        break;
      case 2:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMDateString() + ' ||  ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████ ||\n'
        );
        break;
      case 3:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMDateString() + ' ||  ████ Location:'+ url + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      case 4:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMDateString() + ' || ████ Location:'+ url + ' ████  RATE:' + rate + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n';
        );
        break;
      case 5:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMDateString() + ' || ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████  DUTY_CYCLE:' + dutyCycle + ' ████ ||\n';
        );
        break;
      case 6:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMDateString() + ' || ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████ & ████ RATE:' + rate + ' ████  ||\n';
        );
        break;
      case 7:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMDateString() + ' || ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████ & ████ RATE:' + rate + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n';
        );
        break;
      default:
        throw new Error('[Error] LogLevel must in section [1, 7].');
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
      this.writeToLog(logPath, logLevel);
    }
  }

  getContent(total) {
    this.match(total);
    return this.content;
  }
}

export default Thing;
