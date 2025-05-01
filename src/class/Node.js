import os from 'os';
import path from 'path';
import fs from 'fs';
import Mixture from '~/class/Mixture';
import getDateString from '~/lib/getDateString';
import checkLogPath from '~/lib/checkLogPath';

function checkMemory(logPath) {
  if (os.freemem() > 0) {
    return true;
  } else {
    fs.appendFileSync(
      path.join(logPath, dateString),
      '[Memory] Memory space is exhausted;\n',
    );
    return false;
  }
}

function dealCharCode(code) {
  if (code >=  65 && code <= 90) {
    return code - 65;
  } else if (code >= 97 && code <= 122) {
    return code - 97;
  } else if (code >= 48 && code <= 57) {
    return code - 48;
  }
}

class Node {
  constructor(options) {
    this.options = options;
    this.status = -1;
    this.count = 0;
    this.rate = 0;
    this.hash = [];
    this.childrens = [];
    const { logPath, } = this.options;
    checkLogPath(logPath);
  }

  put(key, value) {
    this.checkKey(key);
    const { status, } = this;
    this.childrens.push([key, value]);
    switch (status) {
      case 0:
      case 2: {
        if (this.hash[key.length - 1] === undefined) {
          this.hash[key.length - 1] = {};
        }
        this.hash[key.length - 1][key] = value;
        break;
      }
      case 1:
      case 3: {
        let root = this.hash;
        const { length, } = key;
        for (let i = 0; i < length; i += 1) {
          const code = key.charCodeAt(i);
          if (i === length - 1) {
            root[dealCharCode(code)] = value;
          } else {
            root = root[dealCharCode(code)];
          }
        }
        break;
      }
    }
  }

  checkKey(key) {
    if (typeof key !== 'string') {
      new Error('[Error] Key type must is string.');
    }
    let ans = true;
    let flag;
    for (let i = 0; i < key.length; i += 1) {
      const code = key.charCodeAt(i);
      if ((code >=  65 && code <= 90) || ((code >= 97 && code <= 122))) {
        if (flag!== undefined) {
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
      }
    }
    if (ans === false) {
      new Error('[Error] Key must is pure numbersor pure letters.');
    } else {
      switch (flag) {
        case 0: {
          if (this.status === -1) {
            this.status = 0;
          } else if (this.status !== 0) {
            throw new Error('[Error] This node is pure letters node,add content must is letters.');
          }
          break;
        }
        case 1: {
          if (this.status === -1) {
            this.status = 1;
          } else if (this.status !== 2) {
            throw new Error('[Error] This node is pure numbers node,add content must is numbers.');
          }
          this.status = 2;
          break;
        }
      }
    }
  }

  changeFromNode(mixture) {
    const node = mixture.getNode();
    this.hash = node.hash;
    this.childrens = node.childrens;
    this.mixture = mixture;
  }

  changeFromThing(mixture, beforePath) {
    const node = mixture.getNode();
    this.put(beforePath, node);
    this.childrens = node.childrens;
    this.mixture = mixture;
  }

  greaterThresholdAndBond() {
    const { threshold, bond, } = this.options;
    if (threshold === undefined && bond !== undefined) {
      const { count, } = this;
      return count >= bond;
    }
    if (threshold !== undefined && bond === undefined) {
      const { rate, } = this;
      return rate >= threshold;
    }
    if (threshold !== undefined && bond !== undefined) {
      const { rate, count, } = this;
      return rate >= threshold && count >= bond;
    }
    throw Error("Threshold and bond can't is empty together.");
  }

  lessThresholdAndBond() {
    const { threshold, bond, } = this.options;
    if (threshold === undefined && bond !== undefined) {
      const { count, } = this;
      return count < bond;
    }
    if (threshold !== undefined && bond === undefined) {
      const { rate, } = this;
      return rate < threshold;
    }
    if (threshold !== undefined && bond !== undefined) {
      const { rate, count, } = this;
      return rate < threshold && count < bond;
    }
    throw Error("Threshold and bond can't is empty together.");
  }

  get(key, total) {
    this.count += 1;
    const { threshold, bond, logPath, } = this.options;
    const { count, } = this;
    this.rate = count / total;
    const { rate, status, } = this;
    if ((status === 0 || status === 2) && this.greaterThresholdAndBond() && checkMemory(logPath)) {
      this.expandHash();
    }
    if ((status === 1 || status === 3) && this.lessThresholdAndBond()) {
      this.reduceHash();
    }
    return this.find(key);
  }

  find(key) {
    switch (this.status) {
      case 0:
      case 2: {
        if (this.hash && this.hash[key.length - 1] && this.hash[key.length - 1][key]) {
          return this.hash[key.length - 1][key];
        } else {
          return undefined;
        }
      }
      case 1:
      case 3: {
        let root = this.hash;
        const { length, } = key;
        for (let i = 0; i < length; i += 1) {
          const code = key.charCodeAt(i);
          if (i === length - 1) {
            return root[dealCharCode(code)];
          } else {
            root = root[dealCharCode(code)];
          }
        }
      }
    }
  }

  expandHash() {
    this.hash = [];
    this.childrens.forEach((elem) => {
      const [key, value] = elem;
      this.setExpandHash(key, value);
    });
    if (this.status === 0) {
      this.status = 1;
    } else {
      this.status = 3;
    }
  }

  reduceHash() {
    this.hash = {};
    this.childrens.forEach((elem) => {
      const [key, value] = elem;
      this.hash[key.length - 1][key] = value;
    });
    if (this.status === 1) {
      this.status = 0;
    } else {
      this.status = 2;
    }
  }

  setExpandHash(key, value) {
    let root = this.hash;
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

export default Node;
