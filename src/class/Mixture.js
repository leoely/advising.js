import Cluster from '~/class/Cluster';
import Thing from '~/class/Thing';
import checkMemory from '~/lib/checkMemory';

class Mixture {
  constructor(cluster, thing) {
    this.hash = [cluster, thing];
    const {
      options: {
        logPath,
      },
    } = cluster;
    checkMemory(logPath);
  }

  getCluster() {
    return this.hash[0];
  }

  getThing() {
    return this.hash[1];
  }
}

export default Mixture;
