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
    this.debugInfo('was created successfully');
  }

  log(location) {
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
          ' ||  ████ Location:'+ location + ' ████ & ████ RATE:' + rate + ' ████ || \n'
        );
        break;
      case 2:
        this.appendToLog(
          ' ||  ████ Location:'+ location + ' ████ & ████ COUNT:' + count + ' ████ ||\n'
        );
        break;
      case 3:
        this.appendToLog(
          ' ||  ████ Location:'+ location + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      case 4:
        this.appendToLog(
          ' || ████ Location:'+ location + ' ████  RATE:' + rate + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      case 5:
        this.appendToLog(
          ' || ████ Location:'+ location + ' ████ & ████ COUNT:' + count + ' ████  DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      case 6:
        this.appendToLog(
          ' || ████ Location:'+ location + ' ████ & ████ COUNT:' + count + ' ████ & ████ RATE:' + rate + ' ████  ||\n'
        );
        break;
      case 7:
        this.appendToLog(
          ' || ████ Location:'+ location + ' ████ & ████ COUNT:' + count + ' ████ & ████ RATE:' + rate + ' ████ & ████ DUTY_CYCLE:' + dutyCycle + ' ████ ||\n'
        );
        break;
      default:
        throw new Error('[Error] LogLevel must in section [0, 7].');
    }
  }

  match(total, location) {
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
      this.log(location);
    }
    const { rate, } = this;
    const dutyCycle = this.getDutyCycle();
    this.debugDetail(`
      (+) bold; green: * ~~ (+) yellow; bold: * Location (+) bold; dim: * ` + location + `. &
      (+) bold; green: ** └─ (+): * | (+) bold: * count (+) dim: : ` + count + `(+): * |
      (+) bold: * rate (+) dim: : ` + rate + ` (+): * |
      (+) bold: * dutyCycle (+) dim: : ` + dutyCycle + ` (+): * | &
    `);
  }

  setPathKeys(pathKeys) {
    if (pathKeys !== undefined) {
      if (!Array.isArray(pathKeys)) {
        delete this.pathKeys;
      } else {
        this.pathKeys = pathKeys;
        this.debugInfo('set path keys successfully');
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

  getContent(total, location) {
    if (typeof total !== 'number') {
      throw new Error('[Error] Get content parameter total should be a numberic type.');
    }
    if (typeof location !== 'string') {
      throw new Error('[Error] Get content parameter location should be a string type.');
    }
    this.match(total, location);
    this.debugInfo('get content successfully');
    return this.content;
  }

  setContent(content) {
    checkContent(content);
    this.content = content;
    this.debugInfo('set content successfully');
  }
}

export default Thing;
