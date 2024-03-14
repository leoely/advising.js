import Method from '~/class/Method';

class Server {
  constructor() {
    this.root = {};
  }

  match(url) {
    const splits = url.split('/');
    const paths = splits.slice(1, splits.length);
    const { root, } = this;
    let method;
    let h = root;
    paths.forEach((p, i) => {
      if (i === paths.length - 1) {
        method = h.method[p].method;
      }
      h = h.hash[p];
    });
    return method;
  }

  add(url, method) {
    const splits = url.split('/');
    const paths = splits.slice(1, splits.length);
    const { root, } = this;
    let h = root;
    paths.forEach((p, i) => {
      if (i === paths.length - 1) {
        if (h.method === undefined) {
          h.method = {};
        }
      }
      if (h.hash === undefined) {
        h.hash = {};
      }
      if (i === paths.length - 1) {
        const m = new Method();
        m.method = method;
        h.method[p] = m;
      } else {
        if (h.hash[p] === undefined) {
          h.hash[p] = {};
        }
      }
      h = h.hash[p];
    });
  }
}

export default Server;
