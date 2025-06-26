import Router from '~/class/Router';

function getPathsFromIpv6(ipv6) {
  const paths = [];
  let chars = [];
  for (let i = 0; i <= ipv6.length; i += 1) {
    const char = ipv6.charAt(i);
    switch (char) {
      case ':':
      case '': {
        const path = chars.join('');
        if (path === '') {
          paths.push('0');
        } else {
          paths.push(path);
        }
        chars = [];
        break;
      }
      default:
        if ((char >= '0' && char <= '9') || (char >= 'a' && char <= 'f')) {
          chars.push(char);
        } else {
          throw Error('[Error] Unexpected character in the ipv6 address.');
        }
    }
  }
  return paths;
}

class Ipv6Router extends Router {
  constructor(options = {}) {
    super(options);
  }

  getPathsFromLocation(location) {
    const ipv6 = location;
    return getPathsFromIpv6(ipv6);
  }
}

export default Ipv6Router;
