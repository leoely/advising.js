import os from 'os';

function dealCharCode(code) {
  if (code >=  65 && code <= 90) {
    return code - 65;
  } else if (code >= 97 && code <= 122) {
    return code - 97;
  } else {
    throw Error('Router path is combine with uppercase and lowercase letter.');
  }
}

function getExpandHash(key, value) {
  let root = [];
  const ans = root;
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
  return ans;
}

class Node {
  constructor(options) {
    this.options = options;
    this.status = 0;
    this.count = 0;
    this.rate = 0;
    this.hash = {};
    this.children = [];
  }

  put(key, value) {
    const { status, } = this;
    this.children.push([key, value]);
    switch (status) {
      case 0:
        this.hash[key] = value;
    }
  }

  get(key, total) {
    this.count += 1;
    const { threshold, } = this.options;
    const { count, } = this;
    this.rate = count / total;
    const { rate, status, } = this;
    if (status === 0 && rate >= threshold && os.freemem() > 0) {
      this.expandHash();
    }
    if (status === 1 && rate < threshold) {
      this.reduceHash();
    }
    return this.check(key);
  }

  check(key) {
    switch (this.status) {
      case 0:
        return this.hash[key];
      case 1: {
        let root = this.hash[key.length];
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
    this.children.forEach((e) => {
      const [k, v] = e;
      this.hash[k.length] = getExpandHash(k, v);
    });
    this.status = 1;
  }

  reduceHash() {
    this.hash = {};
    this.children.forEach((e) => {
      const [k, v] = e;
      this.hash[k] = v;
    });
    this.status = 0;
  }
}

export default Node;
