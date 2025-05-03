class Node {
  constructor(options) {
    this.options = options;
    this.rate = 0;
    this.count = 0;
  }

  getDutyCycle() {
    const {
      count,
      options: {
        startTime,
      },
    } = this;
    const now = Date.now();
    return count / ((now - startTime) / 1000 * 60 * 60);
  }
};

export default Node;
