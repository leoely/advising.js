class Mixture {
  constructor(cluster, thing) {
    this.hash = [cluster, thing];
    cluster.checkMemory();
  }

  getCluster() {
    return this.hash[0];
  }

  getThing() {
    return this.hash[1];
  }
}

export default Mixture;
