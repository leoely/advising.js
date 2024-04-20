class Thing {
  constructor(url, thing) {
    this.count = 0;
    this.rate = 0;
    this.url = url;
    this.thing = thing;
  }

  match(total) {
    this.count += 1
    const { count, } = this;
    this.rate = count / total;
    console.log('@['+ this.url + '] count: ' + this.count + ' & rate: ' + this.rate);
  }
}

export default Thing;
