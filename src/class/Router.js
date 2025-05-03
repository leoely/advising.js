import Cluster from '~/class/Cluster';
import Thing from '~/class/Thing';
import Mixture from '~/class/Mixture';
import checkLogPath from '~/lib/checkLogPath';

function getPathsFromUrl(url) {
  if (typeof url !== 'string') {
    throw new Error('[Error] Path type must be a string.');
  } else {
    if (url === '/') {
      throw new Error('[Error] Unable to operate the root path.');
    }
  }
  if (url.charAt(0) !== '/') {
    throw new Error('[Error] Path should start with a slash.');;
  }
  const preprocessPaths = url.split('/');
  return preprocessPaths.slice(1, preprocessPaths.length);
}

function matchRecursion(hash, index, paths, total) {
  const path = paths[index];
  if (index === paths.length - 1) {
    if (hash.mixture instanceof Mixture) {
      return hash.mixture.getThing();
    } else {
      return hash.get(path, total);
    }
  } else {
    return matchRecursion(hash.get(path, total), index + 1, paths, total);
  }
}

class Router {
  constructor(options = {}) {
    const defaultOptions = {
      threshold: 0.01,
      number: 45,
      bond: 500,
      dutyCycle: 500,
      logLevel: 3,
      logInterval: 5,
      logPath: '/tmp/adivising.js/log',
      startTime: Date.now(),
    };
    this.total = 0;
    this.options = Object.assign(defaultOptions, options);
    this.root = new Cluster(this.options);
    checkLogPath(this.options.logPath);
  }

  match(url) {
    const paths = getPathsFromUrl(url);
    this.total += 1;
    const { total, root, } = this;
    return matchRecursion(root, 0, paths, total).getContent();
  }

  add(url, content) {
    const paths = getPathsFromUrl(url);
    const { root, options, } = this;
    let beforePath;
    let beforeHash;
    let hash = root;
    paths.forEach((path, index) => {
      if (index === paths.length - 1) {
        if (hash instanceof Thing) {
          const cluster = new Cluster(options);
          const thing = new Thing(url, content, options);
          cluster.put(path, thing);
          const mixture = new Mixture(cluster, hash);
          beforeHash.changeFromThing(mixture, beforePath);
        } else {
          const entity = hash.find(path);
          if (entity instanceof Cluster) {
            const thing = new Thing(url, content, options);
            const mixture = new Mixture(hash, thing);
            hash.changeFromCluster(mixture);
          } else {
            const thing = new Thing(url, content, options);
            hash.put(path, thing);
          }
        }
      } else {
        if (hash instanceof Cluster && hash.find(path) === undefined) {
          hash.put(path, new Cluster(options));
        } else if (hash instanceof Thing)  {
          const cluster = new Cluster(options);
          cluster.put(path, new Cluster(options));
          const mixture = new Mixture(cluster, hash);
          beforeHash.changeFromThing(mixture, beforePath);
          hash = cluster;
        }
        beforeHash = hash;
        beforePath = path;
        hash = hash.find(path);
      }
    });
  }
}

export default Router;
