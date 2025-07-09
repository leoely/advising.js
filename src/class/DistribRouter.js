import net from 'net';
import {
  getOwnIpAddresses,
  nonZeroByteArray,
} from 'manner.js/server';
import Thing from '~/class/Thing';
import Router from '~/class/Router';

function  getBinBuf(params) {
  if (!Array.isArray(params)) {
    throw new Error('[Error] The params parameter should be an array type.');
  }
  const { length, } = params;
  if (length <= 1) {
    throw new Error('[Error] The length of the params parameter should be greater than or equal to two');
  }
  const pbytes = [];
  params.forEach((param) => {
    switch (typeof param) {
      case 'string':
        pbytes.push(Array.from(Buffer.from(param)));
        break;
      case 'number':
        if (!Number.isInteger(param)) {
          throw new Error('[Error] If the param type is a number, ite should be an integer.');
        }
        pbytes.push(Array.from(nonZeroByteArray.fromInt(param)));
        break;
    }
    pbytes.push(0);
  });
  const buf = Buffer.from(pbytes.flat());
  return buf;
}

class DistribRouter extends Router {
  constructor(options, port, allRouters) {
    super(options);
    this.dealParams(port, allRouters);
  }

  static async combine(distribRouters) {
    if (!Array.isArray(distribRouters)) {
      throw new Error('[Error] The parameter distribRouters should be of array type.');
    }
    const serverPromises = distribRouters.map((distribRouter) => {
      return distribRouter.setUpServer();
    });
    const clientsPromises = distribRouters.map((distribRouter) => {
      return distribRouter.setUpClients();
    });
    await Promise.all(serverPromises.concat(clientsPromises));
    const connectionsPromises = distribRouters.forEach((distribRouter) => {
      return distribRouter.setUpConnections();
    });
  }

  static async release(distribRouters) {
    if (!Array.isArray(distribRouters)) {
      throw new Error('[Error] The parameter distribRouters should be of array type.');
    }
    distribRouters.forEach((distribRouter) => {
      distribRouter.closeClients();
      delete distribRouter.clients;
    });
    for (let i = 0; i < distribRouters.length; i += 1) {
      const distribRouter = distribRouters[i];
      await distribRouter.closeServer();
      delete distribRouter.server;
    }
    distribRouters.forEach((distribRouter) => {
      distribRouter.closeConnections();
      delete distribRouter.connections;
    });
  }

  getAckPromises(callback) {
    if (typeof callback !== 'function') {
      throw new Error('[Error] Parameter callback should be a funciton type.');
    }
    return this.getClients().map((client) => {
      callback(client);
      return new Promise((resolve, reject) => {
        client.on('data', (buf) => {
          const data = buf.toString();
          switch (data) {
            case 'ack':
              resolve();
              break;
          }
        });
      });
    });
  }

  dealParams(port, allRouters) {
    if (Number.isInteger(port) !== true) {
      throw new Error('[Error] The parameter port should be of integer type.');
    }
    this.port = port
    if (Array.isArray(allRouters) !== true) {
      throw new Error('[Error] The parameter routerArray should be array type.');
    }
    const ipAddresses = getOwnIpAddresses();
    const locations = [];
    ipAddresses.forEach((ipAddress) => {
      const { ipv4, ipv6, } = ipAddress;
      locations.push(ipv4 + ':' + port);
      locations.push('[' + ipv6 + ']:' + port);
    });
    const hash = {};
    const routerArray = allRouters.filter((router) => {
      const [_, port] = router;
      if (hash[port] === undefined) {
        hash[port] = true;
      } else {
        throw new Error('[Error] A port can only be bound to one router');
      }
      let flag = true;
      for (let i = 0; i< locations.length ; i += 1) {
        const location = locations[i];
        if (router.join(':') === location) {
          flag = false;
        }
      }
      return flag;
    });
    this.routerArray = routerArray;
  }

  async closeServer() {
    return new Promise((resolve, reject) => {
      this.getServer().close(() => {
        resolve();
      });
    })
  }

  closeClients() {
    this.getClients().forEach((client) => {
      client.destroy();
    });
  }

  closeConnections() {
    const { connections, } = this;
    if (!Array.isArray(connections)) {
      throw new Error('[Error] The connections is not an array type or the combine is not complete.');
    }
    if (connections.length === 0) {
      throw new Error('[Error] The length of the connections is zero.Perhaps the combine was not completed;');
    }
    connections.forEach((connection) => {
      connection.destroy();
    });
  }

  getServer() {
    const { server, } = this;
    if (server === undefined) {
      throw new Error('[Error] The current distributed cluster is not combined and cannot obtain the server');
    }
    return server;
  }

  getConnections() {
    const { server, connections, } = this;
    if (server === undefined) {
      throw new Error('[Error] The current distributed cluster is not combined and cannot obtain the connections');
    }
    return connections;
  }

  getClients() {
    const { clients, } = this;
    if (clients === undefined) {
      throw new Error('[Error] The current distributed cluster is not combined and cannot obtain the clients');
    }
    return clients;
  }

  async setUpServer() {
    const {
      routerArray: {
        length,
      },
    } = this;
    let count = 0;
    this.connections = [];
    this.server = await new Promise((resolve, reject) => {
      const server = net.createServer((connection) => {
        count += 1;
        this.connections.push(connection);
        if (count === length) {
          resolve(server);
        }
      });
      const { port, } = this;
      server.on('error', (error) => {
        throw error;
      });
      server.listen(port);
    });
    const { server, } = this;
    return server;
  }

  async setUpClients() {
    const { routerArray, } = this;
    const clientPromises = routerArray.map((router) => {
      const [ip, port] = router;
      return new Promise((resolve, reject) => {
        const client = net.createConnection(port, ip, () => {
          client.ip = ip;
          client.port = port;
          resolve(client);
        });
        client.on('end', () => {
          const { ip, port, } = client;
          this.removeRouterArray(ip, port);
        });
      });
    });
    this.clients = await Promise.all(clientPromises);
    const { client, } = this;
    return client;
  }

  setUpConnections() {
    this.getConnections().forEach((connection) => {
      connection.on('data', (buf) => {
        this.dealConnectionBuf(buf, connection);
      });
    });
  }

  dealConnectionBuf(buf, connection) {
    const segments = [];
    let s = 0;
    for (let i = 0; i < buf.length; i += 1) {
      if (buf[i] === 0) {
        segments.push(buf.slice(s, i));
        s = i + 1;
      }
    }
    const bigInt1 = nonZeroByteArray.toInt(segments.shift())
    const code = Number(bigInt1);
    let params;
    switch (code) {
      case 0:
      case 4:
      case 5:
        params = segments.map((segment, index) => {
          switch (index) {
            case 0:
              return nonZeroByteArray.toInt(segment);
            default:
              return segment.toString();
          }
        });
        break;
      case 1:
      case 2:
      case 3:
        params = segments.map((segment, index) => {
          return segment.toString();
        });
        break;
    }
    switch (code) {
      case 0: {
        const [bigInt2, ...rests] = params;
        const type = Number(bigInt2);
        switch (type) {
          case 0: {
            if (rests.length !== 2) {
              throw new Error('[Error] The remaining parameter lengths do not match convertion.');
            }
            const [location, content] = rests;
            this.attach(location, JSON.parse(content));
            connection.write('ack');
            break;
          }
          case 1: {
            if (rests.length !== 2) {
              throw new Error('[Error] The remaining parameter lengths do not match convertion.');
            }
            const [location, content] = rests;
            this.attach(location, new Function(content));
            connection.write('ack');
            break;
          }
          default:
            throw new Error('[Error] Type values should be in the range [0, 1].');
        }
        break;
      }
      case 1: {
        if (params.length !== 2) {
          throw new Error('[Error] The parameter lengths do not match convertion.');
        }
        const [location1, location2] = params;
        this.exchange(location1, location2);
        connection.write('ack');
        break;
      }
      case 2: {
        if (params.length !== 1) {
          throw new Error('[Error] The parameters lengths do not match convertion.');
        }
        const [location] = params;
        this.ruin(location);
        connection.write('ack');
        break;
      }
      case 3:
        this.ruinAll(params);
        connection.write('ack');
        break;
      case 4: {
        const [bigInt2, ...rests] = params;
        const type = Number(bigInt2);
        switch (type) {
          case 0: {
            if (rests.length !== 2) {
              throw new Error('[Error] The remaining parameter lengths do not match convertion.');
            }
            const [location, content] = rests;
            this.replace(location, JSON.parse(content));
            connection.write('ack');
            break;
          }
          case 1: {
            if (rests.length !== 2) {
              throw new Error('[Error] The remaining parameter lengths do not match convertion.');
            }
            const [location, content] = rests;
            this.replace(location, new Function(content));
            connection.write('ack');
            break;
          }
          default:
            throw new Error('[Error] Type values should be in the range [0, 1].');
        }
        break;
      }
      case 5: {
        const [bigInt2, ...rests] = params;
        const type = Number(bigInt2);
        switch (type) {
          case 0: {
            if (rests.length !== 2) {
              throw new Error('[Error] The remaining parameter lengths do not match convertion.');
            }
            const [location, content] = rests;
            this.revise(location, JSON.parse(content));
            connection.write('ack');
            break;
          }
          case 1: {
            if (rests.length !== 2) {
              throw new Error('[Error] The remaining parameter lengths do not match convertion.');
            }
            const [location, content] = rests;
            this.revise(location, new Function(content));
            connection.write('ack');
            break;
          }
          default:
            throw new Error('[Error] Type values should be in the range [0, 1].');
        }
        break;
      }
      default:
        throw new Error('[Error] The code value should be in the range [0, 5]');
    }
  }

  dealClients(type, ) {
    this.getClients().forEach((client) => {
      const pbytes = [];
      pbytes.push(Array.from(byteArray.fromInt(type)));
      client.write();
    });
  }

  removeRouterArray(ip, port) {
    const { routerArray, } = this
    for (let i = 0; i < routerArray.length; i += 1) {
      const [routerIp, routerPort] = routerArray;
      if (routerIp === ip && routerPort === port) {
        const { clients, } = this;
        routerArray.splice(i, 1);
        clients.splice(i, 1);
        break;
      }
    }
  }

  checkCombine() {
    const { server, clients, } = this;
    if (server === undefined || clients === undefined) {
      throw new Error('[Error] Distributed node integration is not yet complete.');
    }
  }

  async attachDistrib(location, content) {
    this.checkCombine();
    this.attach(location, content);
    switch (typeof content) {
      case 'function': {
        const ackPromises = this.getAckPromises((client) => {
          client.write(getBinBuf([0, 1, location, content.toString()]));
        });
        await Promise.all(ackPromises);
        break;
      }
      default: {
        const ackPromises = this.getAckPromises((client) => {
          client.write(getBinBuf([0, 0, location, JSON.stringify(content)]));
        });
        await Promise.all(ackPromises);
      }
    }
  }

  async exchangeDistrib(location1, location2) {
    this.checkCombine();
    this.exchange(location1, location2);
    const ackPromises = this.getAckPromises((client) => {
      client.write(getBinBuf([1, location1, location2]));
    });
    await Promise.all(ackPromises);
  }

  async ruinDistrib(location) {
    this.checkCombine();
    this.ruin(location);
    const ackPromises = this.getAckPromises((client) => {
      client.write(getBinBuf([2, location]));
    });
    await Promise.all(ackPromises);
  }

  async ruinAllDistrib(locations) {
    this.checkCombine();
    this.ruinAll(locations);
    const ackPromises = this.getAckPromises((client) => {
      client.write(getBinBuf([3, ...locations]));
    });
    await Promise.all(ackPromises);
  }

  async replaceDistrib(location, multiple) {
    if (multiple instanceof Thing) {
      throw new Error('[Error] Distributed operations are not easy to transmit');
    }
    const content = multiple;
    this.checkCombine();
    this.replace(location, content);
    switch (typeof content) {
      case 'function': {
        const ackPromises = this.getAckPromises((client) => {
          client.write(getBinBuf([4, 1, location, content.toString()]));
        });
        await Promise.all(ackPromises);
        break;
      }
      default: {
        const ackPromises = this.getAckPromises((client) => {
          client.write(getBinBuf([4, 0, location, JSON.stringify(content)]));
        });
        await Promise.all(ackPromises);
      }
    }
  }

  async reviseDistrib(location, content) {
    this.checkCombine();
    this.revise(location, content);
    switch (typeof content) {
      case 'function': {
        const ackPromises = this.getAckPromises((client) => {
          client.write(getBinBuf([5, 1, location, content.toString()]));
        });
        await Promise.all(ackPromises);
        break;
      }
      default: {
        const ackPromises = this.getAckPromises((client) => {
          client.write(getBinBuf([5, 0, location, JSON.stringify(content)]));
        });
        await Promise.all(ackPromises);
      }
    }
  }
}

export default DistribRouter;
