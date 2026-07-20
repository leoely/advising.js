import Router from '~/class/Router';

function getPathsFromNamespaceString(objectString) {
  const paths = [];
  let chars = [];
  for (let i = 0; i <= objectString.length; i += 1) {
    const char = objectString.charAt(i);
    switch (char) {
      case '>':
      case '':
        paths.push(chars.join(''));
        chars = [];
        break;
      default:
        chars.push(char);
    }
  }
  return paths;
}

class NamespaceRouter extends Router {
  constructor(options = {}) {
    super(options);
  }

  getPathsFromLocation(location) {
    const namespaceString = location;
    return getPathsFromNamespaceString(namespaceString);
  }
}

export default ObjectRouter;
