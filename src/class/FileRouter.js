import Router from '~/class/Router';

function getPathsFromAddress(address) {
  const first = address.charAt(0);
  let status;
  let chars = [];
  switch (first) {
    case '/': {
      const { length, } = address;
      address = address.substring(1, length);
      status = 1;
      break;
    }
    case '.':
      status = 0;
      break;
    default:
      status = 2;
  }
  let paths = [];
  const levels = [];
  for (let i = 0; i <= address.length; i += 1) {
    const char = address.charAt(i);
    switch (status) {
      case 0:
        switch (char) {
          case '.':
            chars.push(char);
            break;
          case '/': {
            const relate = chars.join('');
            paths.push(relate);
            chars =[];
            status = 1;
            break;
          }
          case '':
            throw new Error('[Error] Cannot end with a path.');
          default:
            throw new Error('[Error] Relative path format error.');
        }
        break;
      case 1:
        switch (char) {
          case '/':
            throw new Error('[Error] Path cannot be empty.');
          case '.':
            chars.push(char);
            status = 3;
            break;
          case '':
            throw new Error('[Error] Cannot end with a path.');
          default:
            chars.push(char);
            status = 2;
        }
        break;
      case 2:
        switch (char) {
          case '':
            const level = chars.join('');
            if (level.length === 0) {
              throw new Error('[Error] The level name cannot be empty.');
            }
            levels.unshift(level);
            paths = paths.concat(levels);
            chars = [];
            break
          case '/': {
            const directory = chars.join('');
            paths.push(directory);
            chars = [];
            status = 1;
            break
          }
          case '.': {
            const level = chars.join('');
            if (level.length === 0) {
              throw new Error('[Error] The level name cannot be empty.');
            }
            levels.unshift(level);
            chars = [];
            break;
          }
          default:
            chars.push(char);
        }
        break;
      case 3:
        switch (char) {
          case '':
            throw new Error('[Error] Cannot end with a path.');
          case '.':
            chars.push(char);
            break;
          case '/': {
            const relate = chars.join('');
            paths.push(relate);
            chars = [];
            status = 1;
            break;
          }
          default:
            throw new Error('[Error] Relative path format error.');
        }
        break;
    }
  }
  return paths;
}

class FileRouter extends Router {
  constructor(options = {}) {
    super(options);
  }

  getPathsFromLocation(location) {
    const address = location;
    return getPathsFromAddress(address);
  }

  gain(location) {
    this.checkGetPathsFromLocation('gain');
    const {
      options: {
        hideError,
      },
    } = this;
    let paths;
    try {
      paths = this.getPathsFromLocation(location);
    } catch (error) {
      if (hideError === true) {
        return undefined;
      } else {
        throw error;
      }
    }
    return this.match(location, paths);
  }

  attach(address, content) {
    const paths = getPathsFromAddress(address);
    super.add(address, paths, content);
    this.debugInfo('the file address should be unique');
  }
}

export default FileRouter;
