import Node from '~/class/Node';

class Router {
  constructor(threshold) {
    this.threshold = threshold;
    this.root = new Node(threshold);
    this.total = 0;
  }

  match(url) {
    const splits = url.split('/');
    const paths = splits.slice(1, splits.length);
    const { root, } = this;
    let thing;
    let h = root;
    this.total += 1;
    const { total, } = this;
    paths.forEach((p, i) => {
      if (i === paths.length - 1) {
        thing = h.get(p, total);
      } else {
        h = h.get(p, total);
      }
    });
    return thing;
  }

  add(url, thing) {
    const splits = url.split('/');
    const paths = splits.slice(1, splits.length);
    const { root, threshold, } = this;
    let h = root;
    paths.forEach((p, i) => {
      if (i === paths.length - 1) {
        if (h === undefined) {
          h = new Node(threshold);
        }
      }
      if (h === undefined) {
        h = new Node(threshold);
      }
      if (i === paths.length - 1) {
        h.put(p, thing);
      } else {
        if (h.check(p) === undefined) {
          h.put(p, new Node(threshold));
        }
      }
      h = h.hash[p];
    });
  }
}

export default Router;
