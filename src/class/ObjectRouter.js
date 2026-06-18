import Router from '~/class/Router';

function getPathsFromObjectString(objectString) {
  const paths = [];
  let chars = [];
  for (let i = 0; i <= objectString.length; i += 1) {
    const char = objectString.charAt(i);
    switch (char) {
      case '.':
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

class ObjectRouter extends Router {
  constructor(options = {}) {
    super(options);
  }

  getPathsFromLocation(location) {
    const objectString = location;
    return getPathsFromObjectString(objectString);
  }
}

export default ObjectRouter;
