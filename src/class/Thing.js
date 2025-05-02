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
    this.dutyCycle = 0;
    this.url = url;
    this.content = content;
    this.options = options;
    this.interval = 0;
  }

  appendToLog() {
    const {
      dutyCycle,
      count,
      rate,
      url,
      options: {
        logLevel,
        logPath,
      },
    } = this;
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
          getGTMDateString() + ' || ████ Location:'+ url + ' ████  RATE:' + rate + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      case 5:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMDateString() + ' || ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████  DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      case 6:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMDateString() + ' || ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████ & ████ RATE:' + rate + ' ████  ||\n'
        );
        break;
      case 7:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMDateString() + ' || ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████ & ████ RATE:' + rate + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      default:
        throw new Error('[Error] LogLevel must in section [1, 7].');
    }
  }

  setDutyCycle() {
    const { count, options: { startTime, }, } = this;
    const now = Date.now();
    this.dutyCycle = count / ((now - startTime) / 1000 * 60 * 60);
  }

  match(total) {
    this.count += 1
    const { count, } = this;
    this.rate = count / total;
    this.interval += 1;
    const {
      interval,
      options: {
        logInterval,
      },
    } = this;
    if (interval === logInterval) {
      this.interval = 0;
      this.appendToLog();
    }
    this.setDutyCycle();
  }

  getContent(total) {
    this.match(total);
    return this.content;
  }
}

export default Thing;
