import Node from '~/class/Node';
import getGTMNowString from '~/lib/getGTMNowString';

class Thing extends Node {
  constructor(url, content, options) {
    super(options);
    this.url = url;
    this.content = content;
    this.interval = 0;
  }

  log() {
    const {
      count,
      rate,
      url,
      options: {
        logLevel,
        logPath,
      },
    } = this;
    const dutyCycle = this.getDutyCycle();
    switch (logLevel) {
      case 0:
        break;
      case 1:
        this.appendToLog(
          getGTMNowString() + ' ||  ████ Location:'+ url + ' ████ & ████ RATE:' + rate + ' ████ || \n'
        );
        break;
      case 2:
        this.appendToLog(
          getGTMNowString() + ' ||  ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████ ||\n'
        );
        break;
      case 3:
        this.appendToLog(
          getGTMNowString() + ' ||  ████ Location:'+ url + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      case 4:
        this.appendToLog(
          getGTMNowString() + ' || ████ Location:'+ url + ' ████  RATE:' + rate + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      case 5:
        this.appendToLog(
          getGTMNowString() + ' || ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████  DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      case 6:
        appendToLog(
          getGTMNowString() + ' || ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████ & ████ RATE:' + rate + ' ████  ||\n'
        );
        break;
      case 7:
        this.appendToLog(
          getGTMNowString() + ' || ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████ & ████ RATE:' + rate + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      default:
        throw new Error('[Error] LogLevel must in section [0, 7].');
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
      this.log();
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
