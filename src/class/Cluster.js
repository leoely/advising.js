import Mixture from '~/class/Mixture';
import Node from '~/class/Node';

function dealCharCode(code) {
  if (code >=  65 && code <= 90) {
    return code - 65;
  } else if (code >= 97 && code <= 122) {
    return code - 97;
  } else if (code >= 48 && code <= 57) {
    return code - 48;
  }
}

function bitToByte(bit) {
  return bit / 8;
}

function estimateArrayInc(multiple) {
  let length;
  if (Array.isArray(multiple)) {
    const array = multiple;
    length = array.length;
  } else {
    length = multiple;
  }
  return (length * 2 + 1) * 64;
}

function estimateString(string) {
  const { length, } = string;
  return (length + 1) * 4 * 8;
}

function estimatePointer() {
  return 64;
}

function estimateExpandHashInc(key) {
  const { length, } = key;
  let ans = 0;
  for (let i = 0; i < length; i += 1) {
    const value = dealCharCode(key.charCodeAt(i));
    ans += estimateArrayInc(value + 1);
  }
  return ans;
}

function estimateObjectInc(hash) {
  let ans = estimateArrayInc(5);
  const keys = Object.keys(hash);
  ans += estimateArrayInc(keys.length);
  keys.forEach((key) => {
    ans += estimatePointer() + estimateString(key);
  });
  return ans;
}

class Cluster extends Node {
  constructor(options, root) {
    super(options);
    this.status = -1;
    this.number = 0;
    this.checkMemory();
    if (root !== true) {
      this.debugDetail(
        '(+) bold; green: * ^^ (+) blue; bold: * Cluster (+) bold; dim: * was created successfully. &'
      );
    }
  }

  set(key, value) {
    const { status, } = this;
    switch (status) {
      case 0:
      case 3:
      case 6: {
        const { hash, } = this;
        hash[key] = value;
        break;
      }
      case 1:
      case 4:
      case 7:
        this.addMiddleHash(key, value);
        break;
      case 2:
      case 5: {
        const {
          options: {
            interception,
          },
        } = this;
        if (Number.isInteger(interception)) {
          let { hash: root, } = this;
          const { length, } = key;
          for (let i = 0; i < interception; i += 1) {
            const code = key.charCodeAt(i);
            if (i === interception - 1) {
              let tail = root[dealCharCode(code)];
              if (tail === undefined) {
                root[dealCharCode(code)] = {};
              }
              tail = root[dealCharCode(code)];
              tail[key.substring(interception - 1, length)] = value;
            } else {
              root = root[dealCharCode(code)];
            }
          }
        } else {
          let { hash: root, } = this;
          const { length, } = key;
          for (let i = 0; i < length; i += 1) {
            const code = key.charCodeAt(i);
            if (i === length - 1) {
              root[dealCharCode(code)] = value;
            } else {
              root = root[dealCharCode(code)];
            }
          }
        }
        break;
      }
    }
  }

  put(key, value) {
    this.checkKey(key);
    this.number += 1;
    const { status, } = this;
    if (status === 1 || status === 2 || status === 4 || status === 5) {
      this.pushChildrens(key, value);
    }
    this.set(key, value);
    const { number, } = this;
    if (number >= this.options.number) {
      const { status, } = this;
      if (status === 0 || status === 3 || status === 6) {
        this.addInitHash();
      }
    }
    const { count, } = value;
    if (count !== 0) {
      this.addCount(count);
    }
    this.checkMemory();
  }

  update(key, value, swap) {
    const { status, } = this;
    if (status === 1 || status === 2 || status === 4 || status === 5) {
      this.updateChildrens(key, value);
    }
    this.set(key, value);
    this.checkMemory();
  }

  delete(key) {
    if (this.find(key) === undefined) {
      throw new Error('[Error] Delete router does not exist.');
    } else {
      this.number -= 1;
      const { status, } = this;
      if (status === 1 || status === 2 || status === 4 || status === 5) {
        this.removeChildrens(key);
      }
      switch (status) {
        case 0:
        case 3:
        case 6:
          delete this.hash[key];
          break;
        case 1:
        case 4:
        case 6:
          this.removeMiddleHash(key);
          break;
        case 2:
        case 5: {
          const {
            options: {
              interception,
            },
          } = this;
          if (Number.isInteger(interception)) {
            let { hash: root, } = this;
            const { length, } = key;
            for (let i = 0; i < interception; i += 1) {
              const code = key.charCodeAt(i);
              if (i === interception - 1) {
                delete root[dealCharCode(code)];
              } else {
                const index = dealCharCode(code);
                delete root[index];
              }
            }
          } else {
            let beforeRoot;
            let { hash: root, } = this;
            const { length, } = key;
            for (let i = 0; i < length; i += 1) {
              const code = key.charCodeAt(i);
              if (i === length - 1) {
                delete root[dealCharCode(code)];
              } else {
                const index = dealCharCode(code);
                beforeRoot = root;
                root = root[index];
                delete beforeRoot[index];
              }
            }
          }
          break;
        }
      }
      const { hash, } = this;
      if (Object.keys(hash).length === 0) {
        delete this.hash;
        this.status = -1;
      }
    }
  }

  clean(node, path) {
    const { number, } = this;
    if (number === 0) {
      if (node instanceof Cluster && typeof path === 'string') {
        node.delete(path);
      }
    }
  }

  subtractCount(count) {
    if (!Number.isInteger(count)) {
      throw new Error(
        '[Error] Number of arguments to subtractCount function be a integer.'
      );
    } else {
      this.count -= count;
      this.adjust();
    }
  }

  addCount(count) {
    if (!Number.isInteger(count)) {
      throw new Error(
        '[Error] Number of arguments to addCount function be a integer.'
      );
    } else {
      this.count += count;
      this.adjust();
    }
    this.checkMemory();
  }

  estimateChildrensInc() {
    const { hash, } = this;
    let ans = 0;
    const keys = Object.keys(hash);
    ans += estimateArrayInc(keys);
    ans += 2 * estimateArrayInc(keys);
    keys.forEach((key) => {
      ans += estimateString(key);
      ans += estimatePointer();
    });
    return ans;
  }

  estimateExpandInitInc() {
    const { hash, } = this;
    const keys = Object.keys(hash);
    let ans = this.estimateChildrensInc();
    keys.forEach((key) => {
      ans += estimateExpandHashInc(key) - estimateString(key);
    });
    ans -= estimateObjectInc(hash);
    return ans;
  }

  estimateExpandMiddleInc() {
    const { hash, } = this;
    let ans = -estimateArrayInc(hash);
    hash.forEach((multiple) => {
      if (typeof multiple === 'object') {
        const object = multiple;
        ans -= estimateObjectInc(object);
        Object.keys(object).forEach((key) => {
          ans += estimateExpandHashInc(key);
        });
      }
    });
    return ans;
  }

  checkExpandInitMemory() {
    const childrensInc = this.estimateChildrensInc();
    const expandHashInc = this.estimateExpandInitInc();
    return this.checkMemory(childrensInc + expandHashInc);
  }

  checkExpandMiddleMemory() {
    const expandHashInc = this.estimateExpandMiddleInc();
    return this.checkMemory(expandHashInc);
  }

  addMiddleHash(key, value) {
    const index = key.length - 1;
    const { hash, } = this;
    if (hash[index] === undefined) {
      hash[index] = {};
    }
    hash[index][key] = value;
  }

  removeMiddleHash(key) {
    const index = key.length - 1;
    const { hash, } = this;
    const objectHash = hash[index];
    delete objectHash[key];
    if (Object.keys(objectHash).length === 0) {
      delete hash[index];
    }
  }

  checkKey(key) {
    let ans = true;
    let flag;
    for (let i = 0; i < key.length; i += 1) {
      const code = key.charCodeAt(i);
      if ((code >=  65 && code <= 90) || ((code >= 97 && code <= 122))) {
        if (flag !== undefined) {
          if (flag !== 0) {
            ans = false;
            break;
          }
        }
        flag = 0;
      } else if (code >= 48 && code <= 57) {
        if (flag !== undefined) {
          if (flag !== 1) {
            ans = false;
            break;
          }
        }
        flag = 1;
      } else {
        flag = 2;
        ans = false;
        break;
      }
    }
    if (ans === false) {
      const { status, } = this;
      if (status === -1) {
        this.status = 6;
        this.hash = {};
      }
    } else {
      switch (flag) {
        case 0: {
          const { status, } = this;
          if (status === -1) {
            this.status = 0;
            this.hash = {};
          } else if (status !== 0 && status !== 1 && status !== 2) {
            throw new Error(
              '[Error] Cluster is plain text type but the newly added type is a pure number.'
            );
          }
          break;
        }
        case 1: {
          const { status, } = this;
          if (status === -1) {
            this.status = 3;
            this.hash = {};
          } else if (status !== 3 && status !== 4 && status !== 5) {
            throw new Error(
              '[Error] Cluster is pure numeric type but the newly added is a pure letters.'
            );
          }
          break;
        }
      }
    }
    this.checkMemory();
  }

  blendFromCluster(mixture) {
    const cluster = mixture.getCluster();
    const { hash, childrens, } = cluster;
    this.hash = hash;
    this.childrens = childrens;
    this.mixture = mixture;
    this.checkMemory();
  }

  blendFromThing(mixture, beforePath) {
    const cluster = mixture.getCluster();
    this.put(beforePath, cluster);
    this.childrens = cluster.childrens;
    this.mixture = mixture;
    this.checkMemory();
  }

  extractToCluster() {
    delete this.mixtrue;
  }

  greaterThresholdAndBondAndDutyCycle() {
    const {
      options: {
        threshold, bond, dutyCycle,
      },
    } = this;
    if (threshold === undefined && bond === undefined) {
      return this.getDutyCycle() >= dutyCycle;
    }
    if (threshold === undefined && dutyCycle === undefined) {
      const { count, } = this;
      return count >= bond;
    }
    if (bond === undefined && dutyCycle === undefined) {
      const { rate, } = this;
      return rate >= threshold;
    }
    if (bond !== undefined && dutyCycle !== undefined) {
      const { rate, count, } = this;
      return count >= bond && this.getDutyCycle() >= dutyCycle;
    }
    if (threshold !== undefined && dutyCycle !== undefined) {
      const { rate, count, } = this;
      return threshold >= threshold && this.getDutyCycle() >= dutyCycle;
    }
    if (threshold !== undefined && bond !== undefined) {
      const { rate, count, } = this;
      return rate >= threshold && count >= bond;
    }
    if (threshold !== undefined && bond !== undefined && dutyCycle !== undefined) {
      const { rate, count, } = this;
      return rate >= threshold && count >= bond && this.getDutyCycle() >= dutyCycle;
    }
    throw new Error('[Error] Threshold, bond and dutyCycle cannot be empty at the same time.');
  }

  lessThresholdAndBondAndDutyCycle() {
    const {
      options: {
        threshold, bond, dutyCycle,
      },
    } = this;
    if (threshold === undefined && bond === undefined) {
      return this.getDutyCycle() < dutyCycle;
    }
    if (threshold === undefined && dutyCycle === undefined) {
      const { count, } = this;
      return count < bond;
    }
    if (dutyCycle === undefined && bond === undefined) {
      const { rate, } = this;
      return rate < threshold;
    }
    if (bond !== undefined && dutyCycle !== undefined) {
      const { rate, count, } = this;
      return count < bond && this.getDutyCycle() < dutyCycle;
    }
    if (threshold !== undefined && dutyCycle !== undefined) {
      const { rate, count, } = this;
      return rate < threshold && this.getDutyCycle() < dutyCycle;
    }
    if (threshold !== undefined && bond !== undefined) {
      const { rate, count, } = this;
      return rate < threshold && count < bond;
    }
    if (threshold !== undefined && bond !== undefined && dutyCycle !== undefined) {
      const { rate, count, } = this;
      return rate < threshold && count < bond && this.getDutyCycle() < dutyCycle;
    }
    throw new Error('[Error] Threshold, bond and dutyCycle cannot be empty at the same time.');
  }

  get(key, total) {
    const { status, } = this;
    if (status === -1) {
      throw new Error('[Error] Cluster hash is empty,please add a route first.');
    }
    if (typeof total !== 'number') {
      throw new Error('[Error] Cluster acquisition method needs to pass numeric type paramter total.');
    }
    this.count += 1;
    const { count, } = this;
    this.rate = count / total;
    this.adjust();
    return this.find(key);
  }

  adjust() {
    const {
      status,
    } = this;
    if ((status === 0 || status === 3) && this.greaterThresholdAndBondAndDutyCycle() && this.checkExpandInitMemory()) {
      this.expandInitHash();
    }
    if ((status === 1 || status === 4) && this.greaterThresholdAndBondAndDutyCycle() && this.checkExpandMiddleMemory()) {
      this.expandMiddleHash();
    }
    if ((status === 2 || status === 5 || status === 7) && this.lessThresholdAndBondAndDutyCycle()) {
      const { number, } = this;
      if (number > this.options.number) {
        this.reduceMiddleHash();
      } else {
        this.reduceInitHash();
      }
    }
  }

  find(key) {
    const { status, } = this;
    switch (status) {
      case 0:
      case 3:
      case 6:
        return this.hash[key];
      case 1:
      case 4:
      case 7: {
        const { length, } = key;
        const { hash, } = this;
        if (hash && hash[length - 1]) {
          return hash[length - 1][key];
        } else {
          return undefined;
        }
      }
      case 2:
      case 5: {
        const {
          options: {
            interception,
          },
        } = this;
        if (Number.isInteger(interception)) {
          let root = this.hash;
          const { length, } = key;
          for (let i = 0; i < interception; i += 1) {
            const code = key.charCodeAt(i);
            if (i === interception - 1) {
              const tail = root[dealCharCode(code)];
              return tail[key.substring(interception - 1, length)];
            } else {
              if (!Array.isArray(root)) {
                return undefined;
              } else {
                root = root[dealCharCode(code)];
              }
            }
          }
        } else {
          let { hash: root, } = this;
          const { length, } = key;
          for (let i = 0; i < length; i += 1) {
            const code = key.charCodeAt(i);
            if (i === length - 1) {
              return root[dealCharCode(code)];
            } else {
              if (!Array.isArray(root)) {
                return undefined;
              } else {
                root = root[dealCharCode(code)];
              }
            }
          }
        }
        break;
      }
    }
  }

  updateChildrens(key, value) {
    const { childrens, } = this;
    for (let i = 0; i < childrens.length; i += 1) {
      const children = childrens[i];
      const [k] = children;
      if (k === key) {
        childrens[i] = [key, value];
        break;
      }
    }
    this,checkMemory();
  }

  removeChildrens(key) {
    const { childrens, } = this;
    for (let i = 0; i < childrens.length; i += 1) {
      const [k] = childrens[i];
      if (k === key) {
        childrens.splice(i, 1);
        break;
      }
    }
  }

  pushChildrens(key, value) {
    const { childrens, } = this;
    if (childrens === undefined) {
      this.childrens = [];
    }
    this.childrens.push([key, value]);
    this.checkMemory();
  }

  addInitHash() {
    const { hash, } = this;
    const keys = Object.keys(hash);
    const values = keys.map((key) => hash[key]);
    this.hash = [];
    keys.forEach((key, index) => {
      const value = values[index];
      this.addMiddleHash(key, value);
      this.pushChildrens(key, value);
    });
    const { status, } = this;
    if (status === 0) {
      this.status = 1;
    } else if (status === 3) {
      this.status = 4;
    } else {
      this.status = 7;
    }
  }

  removeMiddleHash() {
    const { childrens, } = this;
    this.hash = {};
    const { hash, } = this;
    childrens.forEach((children) => {
      const [key, value] = children;
      hash[key] = value;
    });
    delete this.childrens;
    const { status, } = this;
    if (status === 1) {
      this.status = 0;
    } else if (status === 4) {
      this.status = 3;
    } else {
      this.status = 6;
    }
  }

  expandInitHash() {
    const { hash, } = this;
    const keys = Object.keys(hash);
    const values = keys.map((key) => hash[key]);
    this.hash = [];
    this.childrens = [];
    keys.forEach((key, index) => {
      const value = values[index];
      this.setExpandHash(key, value);
      this.pushChildrens(key, value);
    });
    const { status, } = this;
    if (status === 0) {
      this.status = 2;
    } else {
      this.stauts = 5;
    }
  }

  expandMiddleHash() {
    this.hash = [];
    const { childrens, } = this;
    childrens.forEach((children) => {
      const [key, value] = children;
      this.setExpandHash(key, value);
    });
    const { status, } = this;
    if (status === 1) {
      this.status = 2;
    } else {
      this.status = 5;
    }
  }

  reduceMiddleHash() {
    this.hash = [];
    const { childrens, } = this;
    childrens.forEach((elem) => {
      const [key, value] = elem;
      const { hash, } = this;
      const { length, } = key;
      if (hash[length - 1] === undefined) {
        hash[length - 1] = {};
      }
      hash[length - 1][key] = value;
    });
    const { status, } = this;
    if (status === 5) {
      this.status = 4;
    } else if (status === 2) {
      this.status = 1;
    } else {
      this.status = 6;
    }
  }

  reduceInitHash() {
    this.hash = {};
    const { childrens, } = this;
    this.childrens.forEach((elem) => {
      const [key, value] = elem;
      const { hash, } = this;
      hash[key] = value;
    });
    const { status, } = this;
    if (status === 5) {
      this.status = 3;
    } else {
      this.status = 0;
    }
  }

  setExpandHash(key, value) {
    const {
      options: {
        interception,
      },
    } = this;
    if (Number.isInteger(interception)) {
      let { hash: root, } = this;
      const { length, } = key;
      for (let i = 0; i < interception; i += 1) {
        const code = key.charCodeAt(i);
        if (i === interception - 1) {
          let tail = root[dealCharCode(code)];
          if (tail === undefined) {
            root[dealCharCode(code)] = {};
          }
          tail = root[dealCharCode(code)];
          tail[key.substring(interception - 1, length)] = value;
        } else {
          root[dealCharCode(code)] = [];
          root = root[dealCharCode(code)];
        }
      }
    } else {
      let { hash: root, } = this;
      const { length, } = key;
      for (let i = 0; i < length; i += 1) {
        const code = key.charCodeAt(i);
        if (i === length - 1) {
          root[dealCharCode(code)] = value;
        } else {
          root[dealCharCode(code)] = [];
          root = root[dealCharCode(code)];
        }
      }
    }
  }
}

export default Cluster;
