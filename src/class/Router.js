import fs from 'fs';
import { checkLogPath, } from 'manner.js/server';
import Outputable from '~/class/Outputable';
import Node from '~/class/Node';
import Cluster from '~/class/Cluster';
import Thing from '~/class/Thing';
import WebThing from '~/class/WebThing';
import Mixture from '~/class/Mixture';

function matchRecursion(node, index, paths, total, needThing, changeCount, hideError) {
  if (!(node instanceof Node)) {
    if (hideError === true) {
      return undefined;
    } else {
      throw new Error('[Error] There are empty nodes during the matching traversal process');
    }
  }
  const path = paths[index];
  if (index === paths.length - 1) {
    if (node === undefined) {
      if (hideError === true) {
        return undefined;
      } else {
        throw Error('[Error] The current location of the router cannot be found.');
      }
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
        return matchRecursion(node.get(path, total), index + 1, paths, total, needThing, changeCount, hideError);
      } else {
        return matchRecursion(node.find(path), index + 1, paths, total, needThing, changeCount, hideError);
      }
    } else {
      return matchRecursion(node.get(path, total), index + 1, paths, total, needThing, changeCount, hideError);
    }
  }
}

function blendFromThing(node, path, thing, options, beforePath, beforeNode) {
  const cluster = new Cluster(options);
  cluster.put(path, thing);
  const mixture = new Mixture(cluster, node);
  beforeNode.mixFromThing(mixture, beforePath);
  return cluster;
}

function addRecursion(node, index, paths, options, thing, beforePath, beforeNode) {
  const path = paths[index];
  if (index === paths.length - 1) {
    if (node instanceof Thing) {
      blendFromThing(node, path, thing, options, beforePath, beforeNode);
    } else {
      if (node.find(path) instanceof Cluster) {
        node.mixFromCluster(new Mixture(node, thing));
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
      node.delete(path, true);
      if (path !== beforePath) {
        node.clean(beforeNode, beforePath);
      }
    }
    const { count, } = thing;
    node.subtractCount(count, true);
  } else {
    deleteRecursion(node.find(path), index + 1, paths, thing, beforePath, beforeNode);
    const { count, } = thing;
    node.subtractCount(count, true);
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
      throw Error('[Error] The current location of the router cannot be found.');
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

class Router extends Outputable {
  constructor(options = {}) {
    super();
    const defaultOptions = {
      threshold: 0.01,
      number: 10,
      bond: 500,
      dutyCycle: 500,
      logLevel: 7,
      logInterval: 5,
      interception: 8,
      debug: true,
      hideError: false,
      logPath: '/var/log/advising.js/',
    };
    this.options = Object.assign(defaultOptions, options);
    this.dealOptions(options);
    this.total = 0;
    this.root = new Cluster(this.options, true);
    const {
      logPath,
    } = this.options;
    checkLogPath(logPath);
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
    `);
    const {
      constructor: {
        name,
      },
    } = this;
    switch (name) {
      case 'FileRouter':
      case 'Ipv4Router':
      case 'Ipv6Router':
      case 'WebRouter':
      case 'Router':
        this.debugShort(`
          [+] bold:
          | ** - The router is initialized successfully.
          | ** - Related operations cans be performaned.
          |
        `);
        break;
      case 'DistribRouter':
      case 'WebDistribRouter':
        this.debugShort(`
          [+] bold:
          | ** - The "[distributed"] router is initialized successfully.
          | ** - Related "[distributed"] operations cans be performaned.
          |
        `);
        break;
      default:
        throw new Error('[Error] Unexpected types occur.');
    }
  }

  outputOperate(operate, location) {
    const {
      options: {
        logLevel,
        debug,
      },
    } = this;
    if (logLevel !== 0) {
      this.appendToLog(
        ' || ████ Location:' + location + ' ████ & ████ OPERATE:' + operate + ' ████ ||\n',
      );
    }
    if (debug === true) {
      this.debugDetail(`
        (+) bold; green: * ~~ (+) yellow; bold: * Location (+) bold; dim: * ` + location + `. &
        (+) bold; green: ** └─ (+): * | (+) bold: * operate (+) dim: : * ` + operate + `(+): * | &
      `);
    }
  }

  outputOperateError(operate, locations, error) {
    const {
      options: {
        debug,
        logLevel,
      },
    } = this;
    if (debug === true) {
      locations.forEach((location) => {
        this.debugDetail(`
          (+) bold; red: * !! (+) yellow; bold: * Location (+) bold; dim: * ` + location + `. &
          (+) bold; red: ** └─ (+): * | (+) bold: * operate (+) dim: : * ` + operate + `(+): * | &
        `);
      });
    }
    if (logLevel !== 0) {
      locations.forEach((location) => {
        this.appendToLog(
          ' || ████ Location:' + location + ' ████ & ████ OPERATE:' + operate + ' ████ ||\n',
        );
      });
      this.addToLog(error.stack + '\n');
    }
    throw error;
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
        hideError,
        logPath,
      },
    } = this;
    if (threshold !== undefined) {
      if (typeof threshold !== 'number') {
        throw new Error('[Error] Router option threshold must be a numeric type or undefined.');
      }
    }
    if (number !== undefined) {
      if (!Number.isInteger(number) && number >= 0) {
        throw new Error('[Error] Router option number must be a integer type or undefined.');
      }
    }
    if (bond !== undefined) {
      if (!Number.isInteger(bond) && bond >= 0) {
        throw new Error('[Error] Router option bond must be a integer type or undefined.');
      }
    }
    if (dutyCycle !== undefined) {
      if (!Number.isInteger(dutyCycle) && dutyCycle >= 0) {
        throw new Error('[Error] Router option dutyCycle must be a integer type or undefined.');
      }
    }
    if (logLevel !== undefined) {
      if (!Number.isInteger(logLevel) && logLevel >= 0) {
        throw new Error('[Error] Router option logLevel must be a integer type or undefined.');
      }
    }
    if (logInterval !== undefined) {
      if (!Number.isInteger(logInterval) && logIntervbal >= 0) {
        throw new Error('[Error] Router option logLevel must be a integer type or undefined.');
      }
    }
    if (interception !== undefined) {
      if (!Number.isInteger(interception) && interception >= 0) {
        throw new Error('[Error] Router option intercpetion must be a integer type or undefined.');
      }
    }
    if (logPath !== undefined) {
      if (typeof logPath !== 'string') {
        throw new Error('[Error] Router option logPath must be a string type or undefined.');
      }
    }
    if (hideError !== undefined) {
      if (typeof hideError !== 'boolean') {
        throw new Error('[Error] Router option hideError must be a boolean type or undefined.');
      }
    }
  }

  getThingClass() {
    return Thing;
  }

  match(location, paths, needThing, changeCount) {
    try {
      this.total += 1;
      const {
        total,
        root,
        options: {
          hideError,
        },
      } = this;
      const thing = matchRecursion(root, 0, paths, total, needThing, changeCount, hideError);
      if (thing === undefined) {
        if (hideError === true) {
          return thing;
        } else {
          throw Error('[Error] Router matching the location does not exist.');
        }
      } else {
        if (needThing === true) {
          return thing;
        } else {
          return thing.getContent(total, location);
        }
      }
      this.debugInfo('successfully matched');
    } catch (error) {
      this.outputOperateError('match', [location], error);
    }
  }

  add(location, paths, multiple, pathKeys) {
    try {
      if (multiple instanceof Thing) {
        const thing = multiple;
        addRecursion(root, 0, paths, options, thing);
      } else {
        const content = multiple;
        const { root, options, } = this;
        const ThingClass = this.getThingClass();
        switch (ThingClass.name) {
          case 'WebThing': {
            const thing = new ThingClass(options, content, pathKeys);
            addRecursion(root, 0, paths, options, thing);
            break;
          }
          default: {
            const thing = new ThingClass(options, content);
            addRecursion(root, 0, paths, options, thing);
            break;
          }
        }
      }
      this.outputOperate('add', location);
    } catch (error) {
      this.outputOperateError('add', [location], error);
    }
  }

  delete(location, paths) {
    try {
      const thing = this.match(location, paths, true);
      if (thing instanceof Thing) {
        const { root, } = this;
        const [path] = paths;
        deleteRecursion(root, 0, paths, thing, path, root);
        this.outputOperate('delete', location);
      } else {
        throw new Error('[Error] The deleted route dose not exist.');
      }
    } catch (error) {
      this.outputOperateError('delete', [location], error);
    }
  }

  deleteAll(paramArray) {
    paramArray.forEach(([location, paths]) => {
      this.delete(location, paths);
    });
  }

  update(location, paths, multiple, pathKeys) {
    try {
      const thing = this.match(location, paths, true);
      if (thing !== undefined) {
        const { root, } = this;
        const [path] = paths;
        if (multiple instanceof Thing) {
          const newThing = multiple;
          if (newThing instanceof WebThing) {
            newThing.setPathKeys(pathKeys);
          }
          updateRecursion(root, 0, paths, thing, newThing, path, root);
        } else {
          const content = multiple;
          const [path] = paths;
          const { root, options, } = this;
          const ThingClass = this.getThingClass();
          const newThing = new ThingClass(options, content);
          if (newThing instanceof WebThing) {
            newThing.setPathKeys(pathKeys);
          }
          updateRecursion(root, 0, paths, thing, newThing, path, root);
        }
        this.outputOperate('update', location);
      } else {
        throw new Error('[Error] The updated route already exists.');
      }
    } catch (error) {
      this.outputOperateError('update', [location], error);
    }
  }

  swap(location1, location2, paths1, paths2) {
    try {
      const thing1 = this.match(location1, paths1, true);
      const thing2 = this.match(location2, paths2, true);
      this.update(location2, paths2, thing1);
      this.update(location1, paths1, thing2);
      this.outputOperate('swap', location1);
      this.outputOperate('swap', location2);
    } catch (error) {
      this.outputOperateError('swap', [location1, location2], error);
    }
  }

  fix(location, paths, content) {
    try {
      const thing = this.match(location, paths, true);
      if (thing !== undefined) {
        thing.setContent(content)
        this.outputOperate('fix', location);
      } else {
        throw new Error('[Error] The corrected route does not exist.');
      }
    } catch (error) {
      this.outputOperateError('fix', [location], error);
    }
  }

  checkGetPathsFromLocation(method) {
    const { getPathsFromLocation, } = this;
    if (typeof getPathsFromLocation !== 'function') {
      throw new Error('[Error] Only the router subclass that implements method getPathFromLocation can call ' + method + ' method.');
    }
  }

  attach(location, content) {
    this.checkGetPathsFromLocation('attach');
    let paths;
    try {
      paths = this.getPathsFromLocation(location);
    } catch (error) {
      this.outputOperateError('attach', [location], error);
    }
    this.add(location, paths, content);
  }

  exchange(location1, location2) {
    this.checkGetPathsFromLocation('exchange');
    let paths1;
    let paths2;
    try {
      paths1 = this.getPathsFromLocation(location1);
      paths2 = this.getPathsFromLocation(location2);
    } catch (error) {
      this.outputOperateError('exchange', [location1, location2], error);
    }
    this.swap(location1, location2, paths1, paths2);
  }

  ruin(location) {
    this.checkGetPathsFromLocation('ruin');
    let paths;
    try {
      paths = this.getPathsFromLocation(location);
    } catch (error) {
      this.outputOperateError('ruin', [location], error);
    }
    this.delete(location, paths);
  }

  ruinAll(locations) {
    this.checkGetPathsFromLocation('ruinAll');
    let paramArray;
    try {
      paramArray = locations.map((location) => {
        return [location, this.getPathsFromLocation(location)];
      });
    } catch (error) {
      this.outputOpeateError('ruinAll', locations, error);
    }
    this.deleteAll(paramArray);
  }

  replace(location, multiple) {
    this.checkGetPathsFromLocation('replace');
    let paths;
    try {
      paths = this.getPathsFromLocation(location);
    } catch (error) {
      this.outputOperateError('replace', [location], error);
    }
    this.update(url, paths, multiple);
  }

  revise(location, content) {
    this.checkGetPathsFromLocation('revise');
    let paths;
    try {
      paths = this.getPathsFromLocation(location);
    } catch (error) {
      this.outputOperateError('revise', [location], error);
    }
    this.fix(location, paths, content);
  }

  gain(location) {
    this.checkGetPathsFromLocation('gain');
    let paths;
    try {
      paths = this.getPathsFromLocation(location);
    } catch (error) {
      this.outputOperateError('gain', [location], error);
    }
    return this.match(location, paths);
  }
}
export default Router;
