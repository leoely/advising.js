import net from 'net';
import Router from '~/class/Router';

function splitHost(host) {
  const {
    length,
  } = host;
  for (let i = length - 1; i >= 0; i -= 1) {
    const char = host.charAt(i);
    if (char === '.' || char === ']') {
      return [host, undefined];
    }
    if (char === ':') {
      return [host.substring(0, i), host.substring(i + 1, length)]
    }
  }
}

function getPathsFromHost(host) {
  let paths = [];
  const [address, port] = splitHost(host);
  if (net.isIPv4(address)) {
    paths = paths.concat(address.split('.'));
  } else {
    if (/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(address)) {
      address.split('.').forEach((p) => {
        paths = paths.concat(p.split('-'));
      });
    } else {
      const {
        length,
      } = address;
      const ipv6 = address.substring(1, length - 1);
      if (net.isIPv6(ipv6)) {
        paths = ipv6.split(':');
      } else {
        throw new Error('[Error] The host should be a set {ipv4, ipv6, hostname} and port make up.')
      }
    }
  }
  if (port !== undefined) {
    paths.push(port);
  }
  return paths;
}

class HostRouter extends Router {
  constructor(options = {}) {
    super(options);
  }

  getPathsFromLocation(location) {
    const host = location;
    return getPathsFromHost(host);
  }
}

export default HostRouter;
