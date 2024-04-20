import Node from '~/class/Node';
import Thing from '~/class/Thing';

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
    let t;
    let h = root;
    this.total += 1;
    const { total, } = this;
    paths.forEach((p, i) => {
      if (i === paths.length - 1) {
        t = h.get(p, total);
        t.match(total);
      } else {
        h = h.get(p, total);
      }
    });
    return t.thing;
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
        const t = new Thing(url, thing);
        h.put(p, t);
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
