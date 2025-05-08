import Cluster from '~/class/Cluster';
import Thing from '~/class/Thing';
import Mixture from '~/class/Mixture';
import checkLogPath from '~/lib/checkLogPath';
import checkMemory from '~/lib/checkMemory';
import appendToLog from '~/lib/appendToLog';

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

function matchRecursion(node, index, paths, total, needThing) {
  const path = paths[index];
  if (index === paths.length - 1) {
    if (node === undefined) {
      throw Error('[Error] The current url of the router cannot be found.');
    } else {
      if (node.mixture instanceof Mixture) {
        return node.mixture.getThing();
      } else {
        if (needThing === true) {
          return node.find(path);
        } else {
          return node.get(path, total);
        }
      }
    }
  } else {
    if (needThing === true) {
      return matchRecursion(node.find(path, total), index + 1, paths, total, needThing);
    } else {
      return matchRecursion(node.get(path, total), index + 1, paths, total, needThing);
    }
  }
}

function blendFromThing(node, path, thing, options, beforePath, beforeNode) {
  const cluster = new Cluster(options);
  cluster.put(path, thing);
  const mixture = new Mixture(cluster, node);
  beforeNode.blendFromThing(mixture, beforePath);
  return cluster;
}

function addRecursion(node, index, paths, options, thing, beforePath, beforeNode) {
  const path = paths[index];
  if (index === paths.length - 1) {
    if (node instanceof Thing) {
      blendFromThing(node, path, thing, options, beforePath, beforeNode);
    } else {
      if (node.find(path) instanceof Cluster) {
        node.blendFromCluster(new Mixture(node, thing));
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

function deleteRecursion(node, index, paths, thing, beforePath, beforeNode) {
  const path = paths[index];
  if (index === paths.length - 1) {
    if (node.mixture instanceof Mixture) {
      node.extractToCluster();
    } else {
      node.delete(path);
      node.clean(beforeNode, beforePath);
    }
    node.subtractCount(thing.count);
  } else {
    deleteRecursion(node.find(path), index + 1, paths, thing, path, beforeNode);
    node.subtractCount(thing.count);
  }
}

function updateNewThing(node, path, thing, newThing) {
  if (thing === undefined) {
    throw new Error('[Error] router update route does not exist.');
  } else {
    node.update(path, newThing);
  }
}

function updateCount(node, thing, newThing) {
  const { count, } = newThing;
  if (count === 0) {
    node.subtractCount(thing.count);
  } else {
    node.subtractCount(thing.count);
    node.addCount(newThing.count);
  }
}

function updateRecursion(node, index, paths, thing, newThing, beforePath, beforeNode) {
  const path = paths[index];
  if (index === paths.length - 1) {
    if (node === undefined) {
      throw Error('[Error] The current url of the router cannot be found.');
    } else {
      let thing;
      if (node.mixture instanceof Mixture) {
        thing = node.mixture.getThing();
        updateNewThing(node, path, thing, newThing);
      } else {
        thing = node.find(path);
        updateNewThing(node, path, thing, newThing);
      }
      updateCount(node, thing, newThing);
    }
  } else {
    updateRecursion(node.find(path), index + 1, paths, thing, newThing, path, node);
    updateCount(node, thing, newThing);
  }
}

function checkContent(content) {
  if (content === undefined || content === null || Number.isNaN(content)) {
    throw Error('[Error] Value should be reasonable value.');
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
    this.checkOptions();
    this.root = new Cluster(this.options);
    const {
      options: {
        logPath,
      },
    } = this;
    checkMemory(logPath);
  }

  checkOptions() {
    const {
      threshold,
      number,
      bond,
      dutyCycle,
      logLevel,
      logInterval,
      logPath,
    } = this.options;
    if (threshold !== undefined) {
      if (typeof threshold !== 'number') {
        throw new Error('[Error] Router option threshold must be a numeric type or undefined.');
      }
    }
    if (number !== undefined) {
      if (typeof number !== 'number') {
        throw new Error('[Error] Router option number must be a numeric type or undefined.');
      }
    }
    if (bond !== undefined) {
      if (typeof bond !== 'number') {
        throw new Error('[Error] Router option bond must be a numeric type or undefined.');
      }
    }
    if (dutyCycle !== undefined) {
      if (typeof dutyCycle !== 'number') {
        throw new Error('[Error] Router option dutyCycle must be a numeric type or undefined.');
      }
    }
    if (logLevel !== undefined) {
      if (typeof logLevel !== 'number') {
        throw new Error('[Error] Router option logLevel must be a numeric type or undefined.');
      }
    }
    if (logInterval !== undefined) {
      if (typeof logInterval  !== 'number') {
        throw new Error('[Error] Router option logLevel must be a numeric type or undefined.');
      }
    }
    if (logPath !== undefined) {
      if (typeof logPath !== 'string') {
        throw new Error('[Error] Router option logPath must be a string type or undefined.');
      } else {
        checkLogPath(logPath);
      }
    }
  }

  match(url, needThing) {
    const paths = getPathsFromUrl(url);
    this.total += 1;
    const { total, root, } = this;
    const thing = matchRecursion(root, 0, paths, total, needThing);
    if (thing === undefined) {
      throw Error('[Error] Router matching the url does not exist.');
    } else {
      if (needThing === true) {
        return thing;
      } else {
        return thing.getContent(total);
      }
    }
  }

  add(url, multiple) {
    const paths = getPathsFromUrl(url);
    if (multiple instanceof Thing) {
      const thing = multiple;
      addRecursion(root, 0, paths, options, thing);
    } else {
      const content = multiple;
      checkContent(content);
      const { root, options, } = this;
      const thing = new Thing(url, content, options);
      addRecursion(root, 0, paths, options, thing);
    }
  }

  delete(url) {
    const thing = this.match(url, true);
    const paths = getPathsFromUrl(url);
    const { root, } = this;
    const [path] = paths;
    deleteRecursion(root, 0, paths, thing, path, root);
    const {
      options: {
        logPath,
      },
    } = this;
    appendToLog(
      logPath,
      ' || ████ Location:' + url + ' ████ & ████ OPERATE:delete ████ ||\n'
    );
  }

  deleteAll(urls) {
    urls.forEach((url) => {
      this.delete(url);
    });
  }

  update(url, multiple) {
    const thing = this.match(url, true);
    const paths = getPathsFromUrl(url);
    const { root, } = this;
    const [path] = paths;
    if (multiple instanceof Thing) {
      const newThing = multiple;
      updateRecursion(root, 0, paths, thing, newThing, path, root);
    } else {
      const content = multiple;
      checkContent(content);
      const [path] = paths;
      const { root, options, } = this;
      const newThing = new Thing(url, content, options);
      updateRecursion(root, 0, paths, thing, newThing, path, root);
    }
    const {
      options: {
        logPath,
      },
    } = this;
    appendToLog(
      logPath,
      ' || ████ Location:' + url + ' ████ & ████ OPERATE:update ████ ||\n'
    );
  }

  swap(url1, url2) {
    const thing1 = this.match(url1, true);
    const thing2 = this.match(url2, true);
    this.update(url1, thing2, true);
    this.update(url2, thing1, true);
    const {
      options: {
        logPath,
      },
    } = this;
    appendToLog(
      logPath,
      ' || ████ Location:' + url1 + ' ████ & ████ OPERATE:swap ████ ||\n'
    );
    appendToLog(
      logPath,
      ' || ████ Location:' + url2 + ' ████ & ████ OPERATE:swap ████ ||\n'
    );
  }

  fix(url, content) {
    const thing = this.match(url, true);
    thing.setContent(content)
    const {
      options: {
        logPath,
      },
    } = this;
    appendToLog(
      logPath,
      ' || ████ Location:' + url + ' ████ & ████ OPERATE:fix ████ ||\n'
    );
  }
}

export default Router;
