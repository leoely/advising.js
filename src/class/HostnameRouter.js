import Router from '~/class/Router';

function getPathsFromHostname(hostname) {
  const paths = [];
  let chars = [];
  for (let i = hostname.length - 1; i >= -1; i -= 1) {
    const char = hostname.charAt(i);
    switch (char) {
      case '.':
      case '-':
      case '':
        paths.push(chars.join(''));
        chars = [];
        break;
      default:
        if ((char >= '0' && char <= '9') || (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
          chars.push(char);
        } else {
          throw Error('[Error] Unexpected character in the hostname.');
        }
    }
  }
  return paths;
}

class HostnameRouter extends Router {
  constructor(options = {}) {
    super(options);
  }

  getPathsFromLocation(location) {
    const hostname = location;
    return getPathsFromHostname(hostname);
  }
}

export default HostnameRouter;
