import Node from '~/class/Node';
import Thing from '~/class/Thing';
import Mixture from '~/class/Mixture';

class Router {
  constructor(options) {
    this.options = options;
    this.root = new Node(options);
    this.total = 0;
  }

  match(url) {
    const splits = url.split('/');
    const paths = splits.slice(1, splits.length);
    const { root, } = this;
    let hash = root;
    let thing;
    paths.forEach((p, i) => {
      if (i === paths.length - 1) {
        this.total += 1;
        const { total, } = this;
        if (hash.mixture instanceof Mixture) {
          hash = hash.mixture;
          thing = hash.getThing();
        } else {
          thing = hash.get(p, total);
        }
        thing.match(total);
      } else {
        const { total, } = this;
        hash = hash.get(p, total + 1);
      }
    });
    return thing.getContent();
  }

  add(url, content) {
    const splits = url.split('/');
    const paths = splits.slice(1, splits.length);
    const { root, options, } = this;
    let beforePath = paths[0];
    let beforeHash = root;
    let hash = root;
    paths.forEach((path, index) => {
      if (index === paths.length - 1) {
        if (hash === undefined) {
          hash = new Node(options);
        }
      }
      if (hash === undefined) {
        hash = new Node(options);
      }
      if (index === paths.length - 1) {
        if (hash instanceof Thing) {
          const node = new Node(options);
          const thing = new Thing(url, content, options);
          node.put(path, thing);
          const mixture = new Mixture(node, hash);
          beforeHash.changeFromThing(mixture, beforePath);
          return;
        }
        if (hash && hash.hash && hash.hash[path] && hash.hash[path] instanceof Node) {
          const mixture = new Mixture(hash, new Thing(url, content, options));
          hash.changeFromNode(mixture);
        } else {
          const thing = new Thing(url, content, options);
          hash.put(path, thing);
        }
        return;
      } else {
        if (hash.find(path) === undefined) {
          hash.put(path, new Node(options));
        }
      }
      beforeHash = hash;
      beforePath = path;
      hash = hash.hash[path];
    });
  }
}

export default Router;
