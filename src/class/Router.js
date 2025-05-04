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

function matchRecursion(node, index, paths, total) {
  const path = paths[index];
  if (index === paths.length - 1) {
    if (node.mixture instanceof Mixture) {
      return node.mixture.getThing();
    } else {
      return node.get(path, total);
    }
  } else {
    return matchRecursion(node.get(path, total), index + 1, paths, total);
  }
}

function blendFromThing(node, path, thing, options, beforePath, beforeNode) {
  const cluster = new Cluster(options);
  cluster.put(path, thing);
  const mixture = new Mixture(cluster, node);
  beforeNode.changeFromThing(mixture, beforePath);
  return cluster;
}

function addRecursion(node, index, paths, options, thing, beforePath, beforeNode) {
  const path = paths[index];
  if (index === paths.length - 1) {
    if (node instanceof Thing) {
      blendFromThing(node, path, thing, options, beforePath, beforeNode);
    } else {
      if (node.find(path) instanceof Cluster) {
        node.changeFromCluster(new Mixture(node, thing));
      } else {
        node.put(path, thing);
      }
    }
  } else {
    if (node instanceof Cluster && node.find(path) === undefined) {
      node.put(path, new Cluster(options));
      addRecursion(
        node.find(path), index + 1, paths, options, thing, path, node
      );
    } else if (node instanceof Thing)  {
      const cluster = blendFromThing(node, path, thing, options, beforePath, beforeNode);
      addRecursion(
        cluster.find(path), index + 1, paths, options, thing, path, node
      );
    } else {
      addRecursion(
        node.find(path), index + 1, paths, options, thing, path, node
      );
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
    const paths = getPathsFromUrl(url);
    this.total += 1;
    const { total, root, } = this;
    return matchRecursion(root, 0, paths, total).getContent();
  }

  add(url, content) {
    const paths = getPathsFromUrl(url);
    const { root, options, } = this;
    const thing = new Thing(url, content, options);
    addRecursion(root, 0, paths, options, thing);
  }
}

export default Router;
