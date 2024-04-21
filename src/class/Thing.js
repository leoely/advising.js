class Thing {
  constructor(url, thing, options) {
    this.count = 0;
    this.rate = 0;
    this.url = url;
    this.thing = thing;
    this.options = options;
    this.interval = 0;
  }

  printLog(logLevel) {
    const { url, } = this;
    switch (logLevel) {
      case 1:
        console.log('@['+ url + '] rate: ' + this.rate);
      case 2:
        console.log('@['+ url + '] count: ' + this.count);
      case 3:
        console.log('@['+ url + '] count: ' + this.count + ' & rate: ' + this.rate);
    }
  }

  match(total) {
    this.count += 1
    const { count, } = this;
    this.rate = count / total;
    const { logLevel, logInterval, } = this.options;
    this.interval += 1;
    const { interval, } = this;
    if (interval === logInterval) {
      this.interval = 0;
      this.printLog(logLevel);
    }
  }
}

export default Thing;
