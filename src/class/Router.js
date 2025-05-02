import Cluster from '~/class/Cluster';
import Thing from '~/class/Thing';
import Mixture from '~/class/Mixture';
import checkLogPath from '~/lib/checkLogPath';

function validateUrl(url, operate) {
  if (typeof url !== 'string') {
    throw new Error('[Error] Key type must is string.');
  } else {
    if (url === '/') {
      throw new Error('[Error] Can\'t operate root path.');
    }
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
    validateUrl(url);
    const splits = url.split('/');
    const paths = splits.slice(1, splits.length);
    const { root, } = this;
    let hash = root;
    let thing;
    this.total += 1;
    const { total, } = this;
    paths.forEach((path, index) => {
      if (index === paths.length - 1) {
        const { total, } = this;
        if (hash.mixture instanceof Mixture) {
          thing = hash.mixture.getThing();
        } else {
          thing = hash.get(path, total);
        }
      } else {
        hash = hash.get(path, total);
      }
    });
    return thing.getContent(total);
  }

  add(url, content) {
    validateUrl(url);
    const splits = url.split('/');
    const paths = splits.slice(1, splits.length);
    const { root, options, } = this;
    let beforePath;
    let beforeHash;
    let hash = root;
    paths.forEach((path, index) => {
      if (index === paths.length - 1) {
        if (hash instanceof Thing) {
          const node = new Cluster(options);
          const thing = new Thing(url, content, options);
          node.put(path, thing);
          const mixture = new Mixture(node, hash);
          beforeHash.changeFromThing(mixture, beforePath);
          return;
        }
        const entity = hash.find(path);
        if (entity instanceof Cluster) {
          const thing = new Thing(url, content, options);
          const mixture = new Mixture(hash, thing);
          hash.changeFromCluster(mixture);
        } else {
          const thing = new Thing(url, content, options);
          hash.put(path, thing);
        }
        return;
      } else {
        if (hash instanceof Cluster && hash.find(path) === undefined) {
          hash.put(path, new Cluster(options));
        } else if (hash instanceof Thing)  {
          const node = new Cluster(options);
          node.put(path, new Cluster(options));
          const mixture = new Mixture(node, hash);
          beforeHash.changeFromThing(mixture, beforePath);
          hash = node;
        }
      }
      beforeHash = hash;
      beforePath = path;
      hash = hash.find(path);
    });
  }
}

export default Router;
