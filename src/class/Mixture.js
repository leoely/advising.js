import Cluster from '~/class/Cluster';
import Thing from '~/class/Thing';

class Mixture {
  constructor(cluster, thing) {
    if (!(cluster instanceof Cluster)) {
      throw new Error('[Error] Mixture parameter cluster needs to be of cluster type');
    }
    if (!(thing instanceof Thing)) {
      throw new Error('[Error] Mixture parameter thing needs to be of thing of thing type');
    }
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
