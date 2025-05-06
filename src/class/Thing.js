import fs from 'fs';
import path from 'path';
import Node from '~/class/Node';
import getDateString from '~/lib/getDateString';
import getGTMNowString from '~/lib/getGTMNowString';

class Thing extends Node {
  constructor(url, content, options) {
    super(options);
    this.url = url;
    this.content = content;
    this.interval = 0;
  }

  appendToLog() {
    const {
      count,
      rate,
      url,
      options: {
        logLevel,
        logPath,
      },
    } = this;
    const dateString = getDateString();
    const dutyCycle = this.getDutyCycle();
    switch (logLevel) {
      case 1:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMNowString() + ' ||  ████ Location:'+ url + ' ████ & ████ RATE:' + rate + ' ████ || \n'
        );
        break;
      case 2:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMNowString() + ' ||  ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████ ||\n'
        );
        break;
      case 3:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMNowString() + ' ||  ████ Location:'+ url + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      case 4:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMNowString() + ' || ████ Location:'+ url + ' ████  RATE:' + rate + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      case 5:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMNowString() + ' || ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████  DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      case 6:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMNowString() + ' || ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████ & ████ RATE:' + rate + ' ████  ||\n'
        );
        break;
      case 7:
        fs.appendFileSync(
          path.join(logPath, dateString),
          getGTMNowString() + ' || ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████ & ████ RATE:' + rate + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
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
  }

  getContent(total) {
    if (typeof total === 'number') {
      this.match(total);
    }
    return this.content;
  }
}

export default Thing;
