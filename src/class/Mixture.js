import Cluster from '~/class/Cluster';
import Thing from '~/class/Thing';

class Mixture {
  constructor(cluster, thing) {
    this.hash = [cluster, thing];
  }

  getCluster() {
    return this.hash[0];
  }

  getThing() {
    return this.hash[1];
  }
}

export default Mixture;
