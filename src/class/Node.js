class Node {
  getDutyCycle() {
    const { count, options: { startTime, }, } = this;
    const now = Date.now();
    return count / ((now - startTime) / 1000 * 60 * 60);
  }
};

export default Node;
