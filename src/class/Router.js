import fs from 'fs';
import Outputable from '~/class/Outputable';
import Cluster from '~/class/Cluster';
import Thing from '~/class/Thing';
import Mixture from '~/class/Mixture';

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
  const paths = url.split('/');
  return paths.slice(1, paths.length);
}

function matchRecursion(node, index, paths, total, needThing, changeCount) {
  const path = paths[index];
  if (index === paths.length - 1) {
    if (node === undefined) {
      throw Error('[Error] The current url of the router cannot be found.');
    } else {
      if (node.mixture instanceof Mixture) {
        return node.mixture.getThing();
      } else {
        if (needThing === true) {
          if (changeCount === true) {
            return node.get(path, total);
          } else {
            return node.find(path);
          }
        } else {
          return node.get(path, total);
        }
      }
    }
  } else {
    if (needThing === true) {
      if (changeCount === true) {
        return matchRecursion(node.get(path, total), index + 1, paths, total, needThing, changeCount);
      } else {
        return matchRecursion(node.find(path), index + 1, paths, total, needThing, changeCount);
      }
    } else {
      return matchRecursion(node.get(path, total), index + 1, paths, total, needThing, changeCount);
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
    const { count, } = thing;
    node.subtractCount(count);
  } else {
    deleteRecursion(node.find(path), index + 1, paths, thing, path, beforeNode);
    const { count, } = thing;
    node.subtractCount(count);
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

function checkLogPath(logPath) {
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true });
  }
}

class Router extends Outputable {
  constructor(options = {}) {
    super();
    const defaultOptions = {
      threshold: 0.01,
      number: 45,
      bond: 500,
      dutyCycle: 500,
      logLevel: 3,
      logInterval: 5,
      interception: 8,
      debug: true,
      logPath: '/tmp/adivising.js/log',
    };
    this.options = Object.assign(defaultOptions, options);
    this.dealOptions(options);
    this.total = 0;
    this.root = new Cluster(this.options, true);
    this.checkMemory();
    this.debugShort(`
      [+] bold:
      |
      | ** ░█████╗░██████╗░██╗░░░██╗██╗░██████╗██╗███╗░░██╗░██████╗░░░░░░░░░██╗░██████╗
      | ** ██╔══██╗██╔══██╗██║░░░██║██║██╔════╝██║████╗░██║██╔════╝░░░░░░░░░██║██╔════╝
      | ** ███████║██║░░██║╚██╗░██╔╝██║╚█████╗░██║██╔██╗██║██║░░██╗░░░░░░░░░██║╚█████╗░
      | ** ██╔══██║██║░░██║░╚████╔╝░██║░╚═══██╗██║██║╚████║██║░░╚██╗░░░██╗░░██║░╚═══██╗
      | ** ██║░░██║██████╔╝░░╚██╔╝░░██║██████╔╝██║██║░╚███║╚██████╔╝██╗╚█████╔╝██████╔╝
      | ** ╚═╝░░╚═╝╚═════╝░░░░╚═╝░░░╚═╝╚═════╝░╚═╝╚═╝░░╚══╝░╚═════╝░╚═╝░╚════╝░╚═════╝░
      |
      | ** - The router is initialized successfully.
      | ** - Related operations cans be performaned.
      |
    `);
  }

  outputOperate(operate, url) {
    const {
      options: {
        logLevel,
        debug,
      },
    } = this;
    if (logLevel !== 0) {
      this.appendToLog(
        ' || ████ Location:' + url + ' ████ & ████ OPERATE:' + operate + '████ ||\n',
      );
    }
    if (debug === true) {
      this.debugDetail(`
        (+) bold; green: * ~~ (+) yellow; bold: * Location (+) bold; dim: * ` + url + `. &
        (+) bold; green: ** └─ (+): * | (+) bold: * operate (+) dim: : ` + operate + `(+): * | &
      `);
    }
  }

  dealOptions() {
    const {
      options: {
        threshold,
        number,
        bond,
        dutyCycle,
        logLevel,
        logInterval,
        interception,
        logPath,
      },
    } = this;
    if (threshold !== undefined) {
      if (typeof threshold !== 'number') {
        throw new Error('[Error] Router option threshold must be a numeric type or undefined.');
      }
    }
    if (number !== undefined) {
      if (!Number.isInteger(number)) {
        throw new Error('[Error] Router option number must be a integer type or undefined.');
      }
    }
    if (bond !== undefined) {
      if (!Number.isInteger(bond)) {
        throw new Error('[Error] Router option bond must be a integer type or undefined.');
      }
    }
    if (dutyCycle !== undefined) {
      if (!Number.isInteger(dutyCycle)) {
        throw new Error('[Error] Router option dutyCycle must be a integer type or undefined.');
      }
    }
    if (logLevel !== undefined) {
      if (!Number.isInteger(logLevel)) {
        throw new Error('[Error] Router option logLevel must be a integer type or undefined.');
      }
    }
    if (logInterval !== undefined) {
      if (!Number.isInteger(logInterval)) {
        throw new Error('[Error] Router option logLevel must be a integer type or undefined.');
      }
    }
    if (interception !== undefined) {
      if (!Number.isInteger(interception)) {
        throw new Error('[Error] Router option logLevel must be a integer type or undefined.');
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

  match(url, needThing, changeCount) {
    const paths = getPathsFromUrl(url);
    this.total += 1;
    const { total, root, } = this;
    const thing = matchRecursion(root, 0, paths, total, needThing, changeCount);
    if (thing === undefined) {
      throw Error('[Error] Router matching the url does not exist.');
    } else {
      if (needThing === true) {
        return thing;
      } else {
        return thing.getContent(total, url);
      }
    }
    this.debugInfo('successfully matched');
  }

  add(url, multiple, pathKeys) {
    const paths = getPathsFromUrl(url);
    if (multiple instanceof Thing) {
      const thing = multiple;
      addRecursion(root, 0, paths, options, thing);
    } else {
      const content = multiple;
      const { root, options, } = this;
      const thing = new Thing(content, options, pathKeys);
      addRecursion(root, 0, paths, options, thing);
    }
    this.outputOperate('add', url);
  }

  delete(url) {
    const thing = this.match(url, true);
    const paths = getPathsFromUrl(url);
    const { root, } = this;
    const [path] = paths;
    deleteRecursion(root, 0, paths, thing, path, root);
    this.outputOperate('delete', url);
  }

  deleteAll(urls) {
    urls.forEach((url) => {
      this.delete(url);
    });
  }

  update(url, multiple, pathKeys) {
    const thing = this.match(url, true);
    const paths = getPathsFromUrl(url);
    const { root, } = this;
    const [path] = paths;
    if (multiple instanceof Thing) {
      const newThing = multiple;
      newThing.setPathKeys(pathKeys);
      updateRecursion(root, 0, paths, thing, newThing, path, root);
    } else {
      const content = multiple;
      const [path] = paths;
      const { root, options, } = this;
      const newThing = new Thing(content, options);
      newThing.setPathKeys(pathKeys);
      updateRecursion(root, 0, paths, thing, newThing, path, root);
    }
    this.outputOperate('update', url);
  }

  swap(url1, url2) {
    const thing1 = this.match(url1, true);
    const thing2 = this.match(url2, true);
    this.update(url1, thing2);
    this.update(url2, thing1);
    this.outputOperate('swap', url1);
    this.outputOperate('swap', url2);
  }

  fix(url, content) {
    const thing = this.match(url, true);
    thing.setContent(content)
    this.outputOperate('fix', url);
  }
}

export default Router;
