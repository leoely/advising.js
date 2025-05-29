import Router from '~/class/Router';

function getPathsFromAddress(address) {
  const first = address.charAt(0);
  let status;
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
      throw new Error('[Error] Must be a relative path or an absolute path.');
  }
  let chars = [];
  let paths = [];
  let filename;
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
            status = 4;
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
            const simpleName = chars.join('');
            paths.push(simpleName);
            chars = [];
            status = 1;
            break
          case '/': {
            const directory = chars.join('');
            paths.push(directory);
            chars = [];
            status = 1;
            break
          }
          case '.': {
            const front = chars.join('');
            if (front.length === 0) {
              throw new Error('[Error] The file name cannot be empty.');
            }
            filename = front;
            chars = [];
            status = 3;
            break;
          }
          default:
            chars.push(char);
        }
        break;
      case 3:
        switch (char) {
          case '': {
            const behind = chars.join('');
            if (behind.length === 0) {
              throw new Error('[Error] The file extension cannot be empty.');
            }
            paths.push(behind);
            paths.push(filename);
            chars = [];
            break;
          }
          case '/':
            throw new Error('[Error] The file can only apppear at the end.');
          case '.':
            throw new Error('[Error] The file format is incorrect.');
          default:
            chars.push(char);
        }
        break;
      case 4:
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

  attach(address, content) {
    const paths = getPathsFromAddress(address);
    super.add(address, paths, content);
    this.debugInfo('the file address should be unique');
  }
}

export default FileRouter;
