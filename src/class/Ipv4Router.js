import Router from '~/class/Router';

function getPathsFromIpv4(ipv4) {
  const paths = [];
  let chars = [];
  for (let i = 0; i <= ipv4.length; i += 1) {
    const char = ipv4.charAt(i);
    switch (char) {
      case '.':
      case '':
        if (paths.length <= 3) {
          paths.push(chars.join(''));
          chars = [];
        } else {
          throw new Error('[Error] There are only four segmenets in the ipv4 address');
        }
        break;
      default:
        if (char >= '0' && char <= '9') {
          chars.push(char);
        } else {
          throw Error('[Error] Unexpected character in the ipv4 address.');
        }
    }
  }
  return paths;
}

class Ipv4Router extends Router {
  constructor(options = {}) {
    super(options);
  }

  getPathsFromLocation(location) {
    const ipv4 = location;
    return getPathsFromIpv4(ipv4);
  }
}

export default Ipv4Router;
