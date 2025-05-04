import os from 'os';
import path from 'path';
import fs from 'fs';
import Mixture from '~/class/Mixture';
import Node from '~/class/Node';
import getDateString from '~/lib/getDateString';
import getGTMNowString from '~/lib/getGTMNowString';
import checkLogPath from '~/lib/checkLogPath';

function checkMemory(logPath) {
  if (os.freemem() > 0) {
    return true;
  } else {
    fs.appendFileSync(
      path.join(logPath, dateString),
      getGTMDateString() + ' || ████ ❗❗❗❗ @[Memory]: Memory is exhausted. ████ ||\n'
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

class Cluster extends Node {
  constructor(options) {
    super(options);
    this.status = -1;
    this.number = 0;
  }

  put(key, value) {
    this.checkKey(key);
    this.number += 1;
    const { number, } = this;
    const { status, } = this;
    if (status === 1 || status === 2 || status === 4 || status === 5) {
      this.pushChildrens(key, value);
    }
    switch (status) {
      case 0:
      case 3:
        this.hash[key] = value;
        break;
      case 1:
      case 4:
        this.setMiddleHash(key, value);
        break;
      case 2:
      case 5: {
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
    if (number > this.options.number) {
      if (this.status === 0 || this.status === 3) {
        this.tweakInitHash();
      }
    }
  }

  setMiddleHash(key, value) {
    if (this.hash[key.length - 1] === undefined) {
      this.hash[key.length - 1] = {};
    }
    this.hash[key.length - 1][key] = value;
  }

  checkKey(key) {
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
      throw new Error('[Error] Path must be pure numbers or pure letters.');
    } else {
      switch (flag) {
        case 0: {
          if (this.status === -1) {
            this.status = 0;
            this.hash = {};
          } else if (this.status !== 0 && this.status !== 1 && this.status !== 2) {
            throw new Error('[Error] Cluster is plain text type but the newly added type is a pure number.');
          }
          break;
        }
        case 1: {
          if (this.status === -1) {
            this.status = 3;
            this.hash = {};
          } else if (this.status !== 3 && this.status !== 4 && this.status !== 5) {
            throw new Error('[Error] Cluster is pure numeric type but the newly added is a pure letters.');
          }
          break;
        }
      }
    }
  }

  changeFromCluster(mixture) {
    const cluster = mixture.getCluster();
    this.hash = cluster.hash;
    this.childrens = cluster.childrens;
    this.mixture = mixture;
  }

  changeFromThing(mixture, beforePath) {
    const cluster = mixture.getCluster();
    this.put(beforePath, cluster);
    this.childrens = cluster.childrens;
    this.mixture = mixture;
  }

  greaterThresholdAndBondAndDutyCycle() {
    const { threshold, bond, dutyCycle, } = this.options;
    if (threshold === undefined && bond !== undefined && dutyCycle !== undefined) {
      return this.getDutyCycle() >= dutyCycle;
    }
    if (threshold === undefined && bond !== undefined && dutyCycle === undefined) {
      const { count, } = this;
      return count >= bond;
    }
    if (threshold !== undefined && bond === undefined && dutyCycle === undefined) {
      const { rate, } = this;
      return rate >= threshold;
    }
    if (threshold !== undefined && bond === undefined && dutyCycle === undefined) {
      const { rate, count, } = this;
      return count >= bond && this.getDutyCycle() >= dutyCycle;
    }
    if (threshold === undefined && bond !== undefined && dutyCycle === undefined) {
      const { rate, count, } = this;
      return threshold >= threshold && this.getDutyCycle() >= dutyCycle;
    }
    if (threshold === undefined && bond === undefined && dutyCycle !== undefined) {
      const { rate, count, } = this;
      return rate >= threshold && count >= bond;
    }
    if (threshold !== undefined && bond !== undefined && dutyCycle !== undefined) {
      const { rate, count, } = this;
      return rate >= threshold && count >= bond && this.getDutyCycle() >= dutyCycle;
    }
    throw Error('[Error] Threshold, bond and dutyCycle cannot be empty at the same time.');
  }

  lessThresholdAndBondAndDutyCycle() {
    const { threshold, bond, dutyCycle, startTime, } = this.options;
    if (threshold === undefined && bond !== undefined && dutyCycle !== undefined) {
      return this.getDutyCycle() < dutyCycle;
    }
    if (threshold === undefined && bond !== undefined && dutyCycle === undefined) {
      const { count, } = this;
      return count < bond;
    }
    if (threshold !== undefined && bond === undefined && dutyCycle === undefined) {
      const { rate, } = this;
      return rate < threshold;
    }
    if (threshold !== undefined && bond === undefined && dutyCycle === undefined) {
      const { rate, count, } = this;
      return count < bond && this.getDutyCycle() < dutyCycle;
    }
    if (threshold === undefined && bond !== undefined && dutyCycle === undefined) {
      const { rate, count, } = this;
      return threshold < threshold && this.getDutyCycle() < dutyCycle;
    }
    if (threshold === undefined && bond === undefined && dutyCycle !== undefined) {
      const { rate, count, } = this;
      return rate < threshold && count < bond;
    }
    if (threshold !== undefined && bond !== undefined && dutyCycle !== undefined) {
      const { rate, count, } = this;
      return rate < threshold && count < bond && this.getDutyCycle() < dutyCycle;
    }
    throw Error('[Error] Threshold, bond and dutyCycle cannot be empty at the same time.');
  }

  get(key, total) {
    this.count += 1;
    const { threshold, bond, logPath, } = this.options;
    const { count, } = this;
    this.rate = count / total;
    const { rate, status, } = this;
    if ((status === 1 || status === 4) && this.greaterThresholdAndBondAndDutyCycle() && checkMemory(logPath)) {
      this.expandMiddleHash();
    }
    if ((status === 0 || status === 3) && this.greaterThresholdAndBondAndDutyCycle() && checkMemory(logPath)) {
      this.expandInitHash();
    }
    if ((status === 2 || status === 5) && this.lessThresholdAndBondAndDutyCycle()) {
      if (number > this.options.number) {
        this.reduceMiddleHash();
      } else {
        this.reduceInitHash();
      }
    }
    return this.find(key);
  }

  find(key) {
    switch (this.status) {
      case 0:
      case 3:
        return this.hash[key];
      case 1:
      case 4:{
        if (this.hash && this.hash[key.length - 1] && this.hash[key.length - 1][key]) {
          return this.hash[key.length - 1][key];
        } else {
          return undefined;
        }
      }
      case 2:
      case 5: {
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

  pushChildrens(key, value) {
    const { childrens, } = this;
    if (childrens === undefined) {
      this.childrens = [];
    }
    this.childrens.push([key, value]);
  }

  tweakInitHash() {
    const keys = Object.keys(this.hash);
    const values = keys.map((key) => this.hash[key]);
    this.hash = [];
    keys.forEach((key, index) => {
      const value = values[index];
      this.setMiddleHash(key, value);
      this.pushChildrens(key, value);
    });
    if (this.status === 0) {
      this.status = 1;
    } else {
      this.status = 4;
    }
  }

  expandInitHash() {
    const keys = Object.keys(this.hash);
    const values = keys.map((key) => this.hash[key]);
    this.hash = [];
    this.childrens = [];
    keys.forEach((key, index) => {
      const value = values[index];
      this.setExpandHash(key, value);
      this.pushChildrens(key, value);
    });
    if (this.status === 0) {
      this.status = 2;
    } else {
      this.stauts = 5;
    }
  }

  expandMiddleHash() {
    this.hash = [];
    this.childrens.forEach((elem) => {
      const [key, value] = elem;
      this.setExpandHash(key, value);
    });
    if (this.status === 1) {
      this.status = 2;
    } else {
      this.status = 5;
    }
  }

  reduceMiddleHash() {
    this.hash = [];
    this.childrens.forEach((elem) => {
      const [key, value] = elem;
      this.hash[key.length - 1][key] = value;
    });
    if (this.status === 5) {
      this.status = 4;
    } else {
      this.status = 1;
    }
  }

  reduceMiddleHash() {
    this.hash = {};
    this.childrens.forEach((elem) => {
      this.hash[key] = value;
    });
    if (this.status === 5) {
      this.status = 3;
    } else {
      this.status = 0;
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

export default Cluster;
