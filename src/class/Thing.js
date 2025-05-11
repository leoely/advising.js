import Node from '~/class/Node';

function checkContent(content) {
  if (content === undefined || content === null || Number.isNaN(content)) {
    throw Error('[Error] Value should be reasonable value.');
  }
}

class Thing extends Node {
  constructor(content, options, pathKeys) {
    checkContent(content);
    super(options);
    this.content = content;
    this.interval = 0;
    this.setPathKeys(pathKeys);
    this.checkMemory();
    this.debugDetail(
      '(+) bold; green: * ^^ (+) blue; bold: * Thing (+) bold; dim: * was created successfully. &'
    );
  }

  log(url) {
    const {
      count,
      rate,
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
          ' ||  ████ Location:'+ url + ' ████ & ████ RATE:' + rate + ' ████ || \n'
        );
        break;
      case 2:
        this.appendToLog(
          ' ||  ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████ ||\n'
        );
        break;
      case 3:
        this.appendToLog(
          ' ||  ████ Location:'+ url + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      case 4:
        this.appendToLog(
          ' || ████ Location:'+ url + ' ████  RATE:' + rate + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      case 5:
        this.appendToLog(
          ' || ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████  DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      case 6:
        this.appendToLog(
          ' || ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████ & ████ RATE:' + rate + ' ████  ||\n'
        );
        break;
      case 7:
        this.appendToLog(
          ' || ████ Location:'+ url + ' ████ & ████ COUNT:' + count + ' ████ & ████ RATE:' + rate + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      default:
        throw new Error('[Error] LogLevel must in section [0, 7].');
    }
  }

  match(total, url) {
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
      this.log(url);
    }
  }

  setPathKeys(pathKeys) {
    if (pathKeys !== undefined) {
      if (!Array.isArray(pathKeys)) {
        throw new Error('[Error] Path variables needs to be a string type.');
      } else {
        this.pathKeys = pathKeys;
      }
    }
  }

  getPathKeys() {
    const { pathKeys, } = this;
    if (pathKeys !== undefined) {
      return pathKeys;
    } else {
      throw new Error('[Error] Unable to get path keys because it is not set.');
    }
  }

  getContent(total, url) {
    if (typeof total === 'number') {
      this.match(total, url);
    }
    return this.content;
  }

  setContent(content) {
    checkContent(content);
    this.content = content;
  }
}

export default Thing;
