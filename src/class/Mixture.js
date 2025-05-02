class Mixture {
  constructor(node, thing) {
    this.hash = [node, thing];
  }

  getCluster() {
    return this.hash[0];
  }

  getThing() {
    return this.hash[1];
  }
}

export default Mixture;
