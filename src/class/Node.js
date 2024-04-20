import os from 'os';

function getExpandHash(key, value) {
  let root = [];
  const ans = root;
  const { length, } = key;
  for (let i = 0; i < length; i += 1) {
    const code = key.charCodeAt(i);
    if (i === length - 1) {
      root[code - 97] = value;
    } else {
      root[code - 97] = [];
      root = root[code - 97];
    }
  }
  return ans;
}

class Node {
  constructor(threshold) {
    this.threshold = threshold;
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
    const { count, threshold } = this;
    this.rate = count / total;
    const { rate, status, } = this;
    if (status === 0 && rate >= threshold && os.freemem() > 0) {
      this.expandHash();
    }
    if (status === 1 && rate < threshold) {
      this.reduceHash();
    }
    switch (this.status) {
      case 0:
        return this.hash[key];
      case 1: {
        let root = this.hash[key.length];
        const { length, } = key;
        for (let i = 0; i < length; i += 1) {
          const code = key.charCodeAt(i);
          if (i === length - 1) {
            return root[code - 97];
          } else {
            root = root[code - 97];
          }
        }
      }
    }
  }

  check(key) {
    const { status, } = this;
    switch (status) {
      case 0:
        return this.hash[key];
      case 1: {
        let root = this.hash[key.length];
        const { length, } = key;
        for (let i = 0; i < length; i += 1) {
          const code = key.charCodeAt(i);
          if (i === length - 1) {
            return root[code - 97];
          } else {
            root = root[code - 97];
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
