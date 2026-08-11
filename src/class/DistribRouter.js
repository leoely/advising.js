import EventEmitter from 'events';
import net from 'net';
import {
  getGTMNowString,
  getOwnIpAddresses,
  ByteArray,
  appendToLog,
  getAddress,
} from 'manner.js/server';
import Thing from '~/class/Thing';
import Router from '~/class/Router';

const nonZeroByteArray = new ByteArray({ size: 256n, shift: 1n, });

function getBinBuf(params) {
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

function addBufferFlag(flag, buffer) {
  if (!Number.isInteger(flag)) {
    throw new Error('[Error] The parameter flag should be an integer type');
  }
  if (!Buffer.isBuffer(buffer)) {
    throw new Error('[Error] The parameter buffer should be of type buffer.');
  }
  const fbytes = Buffer.from([flag]);
  return Buffer.concat([fbytes, buffer]);
}

class DistribRouter extends Router {
  constructor(options, port, allRouters) {
    super(options);
    this.dealParams(port, allRouters);
    this.outputDistribTopology();
    this.eventEmitter = new EventEmitter();
    this.dealReceiveBuffer = this.dealReceiveBuffer.bind(this);
    this.dealReceiveAndSendBuffer = this.dealReceiveAndSendBuffer.bind(this);
    this.count = 0;
    this.checkMemory();
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
    distribRouters.map((distribRouter) => {
      distribRouter.setUpSockets(true);
    });
  }

  static async join(newDistribRouters, originDistribRouters, allRouters) {
    originDistribRouters.forEach((originDistribRouter) => {
      originDistribRouter.setAllRouters(allRouters);
    });
    distribRouters = originDistribRouters.concat(newDistribRouters);
    distribRouters.forEach((distribRouter, index) => {
      distribRouter.index = index;
    });
    await DistribRouter.combine(newDistribRouters);
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
    const { eventEmitter, } = this;
    return this.getSockets().map((socket) => {
      callback(socket);
      return new Promise((resolve, reject) => {
        eventEmitter.on('data:receive', (buffer) => {
          const data = buffer.toString();
          switch (data) {
            case 'ack':
              resolve();
              break;
          }
        });
      });
    });
  }

  setAllRouters(allRouters) {
    if (Array.isArray(allRouters) !== true) {
      throw new Error('[Error] The parameter all routers should be array type.');
    }
    const { port, } = this;
    const ipAddresses = getOwnIpAddresses();
    const locations = [];
    ipAddresses.forEach((ipAddress) => {
      const { ipv4, ipv6, } = ipAddress;
      locations.push(getAddress(ipv4, port));
      locations.push(getAddress(ipv6, port));
    });
    const hash = {};
    allRouters = allRouters.map((router, index) => {
      const [ip, port] = router;
      return [ip, port, index];
    });
    const routers = allRouters.filter((router, index) => {
      const [_, port] = router;
      if (hash[port] === undefined) {
        hash[port] = true;
      } else {
        throw new Error('[Error] A port can only be bound to one router');
      }
      let flag = true;
      for (let i = 0; i< locations.length ; i += 1) {
        const location = locations[i];
        const [ip] = router;
        if (getAddress(ip, port) === location) {
          const [ip] = router;
          this.index = index;
          this.ip = ip;
          flag = false;
          break;
        }
      }
      return flag;
    });
    const { ip, } = this;
    this.address = getAddress(ip, this.port);
    this.routers = routers;
  }

  dealParams(port, allRouters) {
    if (Number.isInteger(port) !== true) {
      throw new Error('[Error] The parameter port should be of integer type.');
    }
    if (!(port >= 0)) {
      throw new Error('[Error] Parameter id needs to be a postive integer.');
    }
    this.port = port;
    if (Array.isArray(allRouters) !== true) {
      throw new Error('[Error] The parameter all routers should be array type.');
    }
    const ipAddresses = getOwnIpAddresses();
    const locations = [];
    ipAddresses.forEach((ipAddress) => {
      const { ipv4, ipv6, } = ipAddress;
      locations.push(getAddress(ipv4, port));
      locations.push(getAddress(ipv6, port));
    });
    const hash = {};
    allRouters = allRouters.map((router, index) => {
      const [ip, port] = router;
      return [ip, port, index];
    });
    const routers = allRouters.filter((router, index) => {
      const [_, port] = router;
      if (hash[port] === undefined) {
        hash[port] = true;
      } else {
        throw new Error('[Error] A port can only be bound to one router');
      }
      let flag = true;
      for (let i = 0; i< locations.length ; i += 1) {
        const location = locations[i];
        const [ip] = router;
        if (getAddress(ip, port) === location) {
          const [ip] = router;
          this.index = index;
          this.ip = ip;
          flag = false;
          break;
        }
      }
      return flag;
    });
    const { ip, } = this;
    this.address = getAddress(ip, this.port);
    this.routers = routers;
  }

  outputDistribTopology() {
    const {
      options: {
        debug,
        logLevel,
      },
      fulmination,
    } = this;
    if (logLevel !== 0) {
      const routers = this.getRouters()
      if (routers.length > 0) {
        const routerTopologys = '[' + routers.join(', ') + ']';
        const { ip, port, } = this;
        this.appendToLog(
          ' || ████ Ip:' + ip + ' ████ & ████ Port:' + port + ' ████ & ████ TOPOLOGY:' + routerTopologys + ' ████ ||\n',
        );
      }
    }
    if (debug === true) {
      const routers = this.getRouters();
      if (Array.isArray(routers) && routers.length > 0) {
        const routerFulminations = routers.map((router) => {
          return '(+) bold; dim: "b' + router + '" (+): * | (+): *';
        }).join(' ').concat(' &');
        fulmination.scanAll([
          [`
            (+) blue; bold: * "&"& (+) bold: * DistribRouter (+) bold; dim: * show distributed topology. &
            (+) blue; bold: ** └─ (+) : * | (+) : *
            `, 0],
          [routerFulminations, 0],
        ]);
        console.log(getGTMNowString() + '\n');
      }
    }
  }

  outputDistribOperate(operate, location) {
    const {
      options: {
        logLevel,
        debug,
      },
    } = this;
    if (logLevel !== 0) {
      this.appendToLog(
        ' || ████ Location:' + location + ' ████ & ████ OPERATE:' + operate + ' ████ ||\n',
      );
    }
    if (debug === true) {
      this.debugDetail(`
        (+) bold; blue: * "&"& (+) green; bold: * Location (+) bold; dim: * ` + location + `. &
        (+) bold; blue: ** └─ (+): * | (+) bold: * operate (+) dim: : * ` + operate + `(+): * | &
      `);
    }
  }

  outputDistribOperateError(operate, locations, error) {
    const {
      options: {
        logLevel,
        debug,
      },
    } = this;
    if (logLevel !== 0) {
      locations.forEach((location) => {
        this.appendToLog(
          ' || ████ Location:' + location + ' ████ & ████ OPERATE:' + operate + ' ████ ||\n',
        );
      });
      this.addToLog(error.stack + '\n');
    }
    if (debug === true) {
      locations.forEach((location) => {
        this.debugDetail(`
          (+) bold; red: * !! (+) green; bold: * Location (+) bold; dim: * ` + location + `. &
          (+) bold; red: ** └─ (+): * | (+) bold: * operate (+) dim: : * ` + operate + `(+): * | &
        `);
      })
    }
    throw error;
  }

  outputDistribFunction(operate) {
    const {
      options: {
        logLevel,
        debug,
      },
    } = this;
    if (logLevel !== 0) {
      const { ip, port, } = this;
      this.appendToLog(
        ' || ████ Ip:' + ip + ' ████ & ████ Port:' + port +  ' ████ & ████ OPEARATE:' + operate + ' ████ ||\n',
      );
    }
    if (debug === true) {
      const { ip, port, } = this;
      this.debugDetail(`
        (+) bold; blue: * "&"& (+) green; bold: * Ip (+) bold; dim: * ` + ip + ` (+) green; bold: * Port (+) bold; dim: * ` + port + ` . &
        (+) bold; blue: ** └─ (+): * | (+) bold: * operate (+) dim: : * ` + operate + `(+): * | &
      `);
    }
  }

  outputDistribFunctionError(operate, error) {
    const {
      options: {
        logLevel,
        debug,
      },
    } = this;
    if (logLevel !== 0) {
      const { ip, port, } = this;
      this.appendToLog(
        ' || ████ Ip:' + ip + ' ████ & ████ Port:' + port +  ' ████ & ████ OPEARATE:' + operate + ' ████ ||\n',
      );
      this.addToLog(error.stack);
    }
    if (debug === true) {
      const { ip, port, } = this;
      this.debugDetail(`
        (+) bold; red: * !! (+) green; bold: * Ip (+) bold; dim: * ` + ip + ` (+) green; bold: * Port (+) bold; dim: * ` + port + ` . &
        (+) bold; red: ** └─ (+): * | (+) bold: * operate (+) dim: : * ` + operate + `(+): * | &
      `);
    }
    throw error;
  }

  getRouters() {
    const { routers, } = this;
    if (!Array.isArray(routers)) {
      throw new Error('[Error] The status of routers in distributed routing.');
    }
    return routers;
  }

  async closeServer() {
    try {
      const server = this.getServer();
      if (server !== null) {
        await new Promise((resolve, reject) => {
          this.getServer().close(() => {
            resolve();
          });
        })
      }
      this.outputDistribFunction('close server');
    } catch (error) {
      this.outputDistribFunctionError('close server', error);
    }
  }

  closeClients() {
    try {
      this.getClients().forEach((client) => {
        client.destroySoon();
      });
      this.outputDistribFunction('close client');
    } catch (error) {
      this.outputDistribFunctionError('close client', error);
    }
  }

  closeConnections() {
    try {
      const { connections, } = this;
      if (!Array.isArray(connections)) {
        throw new Error('[Error] The connections is not an array type or the combine is not complete.');
      }
      connections.forEach((connection) => {
        connection.destroySoon();
      });
      this.outputDistribFunction('close connection');
    } catch (error) {
      this.outputDistribFunctionError('close connection', error);
    }
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

  getSockets() {
    this.checkCombine();
    return this.sockets;
  }

  dealReceiveAndSendBuffer(buffer, socket) {
    const flag = buffer[0];
    const {
      length,
    } = buffer;
    buffer = buffer.subarray(1, length);
    switch (flag) {
      case 0: {
        const {
          eventEmitter,
        } = this;
        eventEmitter.emit('data:receive', buffer);
        break;
      }
      case 1: {
        this.dealReceiveBuffer(buffer, socket);
        break;
      }
    }
  }

  async setUpServer() {
    try {
      const {
        routers: {
          length,
        },
      } = this;
      this.connections = [];
      const { index, } = this;
      if (length - index === 0) {
        this.server = net.createServer((connection) => {
          this.connections.push(connection);
          connection.on('data', (buffer) => {
            this.dealReceiveAndSendBuffer(buffer, connection);
          });
          this.setUpSockets(false);
        });
        const { server, } = this;
        server.on('error', (error) => {
          throw error;
        });
        const { port, } = this;
        server.listen(port);
      } else {
        this.server = await new Promise((resolve, reject) => {
          const server = net.createServer((connection) => {
            this.count += 1;
            this.connections.push(connection);
            const { count, } = this;
            if (count === length - index) {
              resolve(server);
            } else if (count > length - index) {
              connection.on('data', (buffer) => {
                this.dealReceiveAndSendBuffer(buffer, connection);
              });
              this.setUpSockets(false);
            }
          });
          const { port, } = this;
          server.on('error', (error) => {
            throw error;
          });
          server.listen(port);
        });
      }
      this.outputDistribFunction('setup client');
      this.checkMemory();
    } catch (error) {
      this.outputDistribFunctionError('setup client', error);
    }
  }

  async setUpClients() {
    try {
      const { routers, index, } = this;
      const clientPromises = [];
      routers.map((router) => {
        const [_1, _2, i] = router;
        if (index > i && i >= 0) {
          const [ip, port] = router;
          const clientPromise = new Promise((resolve, reject) => {
            const client = net.createConnection(port, ip, () => {
              client.ip = ip;
              client.port = port;
              resolve(client);
            });
            client.on('close', () => {
              const { ip, port, } = client;
              this.removeRouter(ip, port);
            });
          });
          clientPromises.push(clientPromise);
        }
      });
      this.clients = await Promise.all(clientPromises);
      const { clients, } = this;
      this.outputDistribFunction('setup client');
      this.checkMemory();
    } catch (error) {
      this.outputDistribFunctionError('setup client', error);
    }
  }

  setUpSockets(bind) {
    if (typeof bind !== 'boolean') {
      throw new Error('[Error] The parameter bind should be boolean type.');
    }
    try {
      const { clients, connections, } = this;
      this.sockets = clients.concat(connections);
      const { sockets: socketList, } = this;
      if (bind === true) {
        socketList.forEach((socket) => {
          socket.on('data', (buffer) => {
            this.dealReceiveAndSendBuffer(buffer, socket);
          });
        })
      }
      this.outputDistribFunction('setup sockets');
      this.checkMemory();
    } catch (error) {
      this.outputDistribFunctionError('setup client', error);
    }
  }

  dealReceiveBuffer(buf, socket) {
    const segments = [];
    let s = 0;
    for (let i = 0; i < buf.length; i += 1) {
      if (buf[i] === 0) {
        segments.push(buf.slice(s, i));
        s = i + 1;
      }
    }
    const bigInt1 = nonZeroByteArray.toInt(segments.shift());
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
      case 6:
        params = segments.map((segment, index) => {
          switch (index) {
            case 0:
              return segment.toString();
            case 1:
              return new Function('return ' + segment.toString())();
          }
        });
    }
    switch (code) {
      case 0: {
        const [bigInt2, ...rests] = params;
        const type = Number(bigInt2);
        switch (type) {
          case 0: {
            if (rests.length !== 2) {
              throw new Error('[Error] The remaining parameter length should be equal to two.');
            }
            const [location, content] = rests;
            this.attach(location, JSON.parse(content));
            socket.write(addBufferFlag(0, Buffer.from('ack')));
            break;
          }
          case 1: {
            if (rests.length !== 2) {
              throw new Error('[Error] The remaining parameter length should be equal to two.');
            }
            const [location, content] = rests;
            this.attach(location, new Function(content));
            socket.write(addBufferFlag(0, Buffer.from('ack')));
            break;
          }
          default:
            throw new Error('[Error] Type values should be in the range [0, 1].');
        }
        break;
      }
      case 1: {
        if (params.length !== 2) {
          throw new Error('[Error] The parameters length should be equal to two.');
        }
        const [location1, location2] = params;
        this.exchange(location1, location2);
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        break;
      }
      case 2: {
        if (params.length !== 1) {
          throw new Error('[Error] The parameters length should be equal to two.');
        }
        const [location] = params;
        this.ruin(location);
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        break;
      }
      case 3:
        this.ruinAll(params);
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        break;
      case 4: {
        const [bigInt2, ...rests] = params;
        const type = Number(bigInt2);
        switch (type) {
          case 0: {
            if (rests.length !== 2) {
              throw new Error('[Error] The remaining parameter length should be equal to two.');
            }
            const [location, content] = rests;
            this.replace(location, JSON.parse(content));
            socket.write(addBufferFlag(0, Buffer.from('ack')));
            break;
          }
          case 1: {
            if (rests.length !== 2) {
              throw new Error('[Error] The remaining parameter length should be equal to two.');
            }
            const [location, content] = rests;
            this.replace(location, new Function(content));
            socket.write(addBufferFlag(0, Buffer.from('ack')));
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
              throw new Error('[Error] The remaining parameter length should be equal to two.');
            }
            const [location, content] = rests;
            this.revise(location, JSON.parse(content));
            socket.write(addBufferFlag(0, Buffer.from('ack')));
            break;
          }
          case 1: {
            if (rests.length !== 2) {
              throw new Error('[Error] The remaining parameter length should be equal to two.');
            }
            const [location, content] = rests;
            this.revise(location, new Function(content));
            socket.write(addBufferFlag(0, Buffer.from('ack')));
            break;
          }
          default:
            throw new Error('[Error] Type values should be in the range [0, 1].');
        }
        break;
      }
      case 6: {
        if (params.length !== 2) {
          throw new Error('[Error] The parameter length should be equal to two.');
        }
        const [phrase, callback] = params;
        this.addSystemNotice(phrase, callback);
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        break;
      }
      default:
        throw new Error('[Error] The code value should be in the range [0, 5]');
    }
  }

  removeRouter(ip, port) {
    const { routers, } = this;
    for (let i = 0; i < routers.length; i += 1) {
      const [routerIp, routerPort] = routers[i];
      if (routerIp === ip && routerPort === port) {
        routers.splice(i, 1);
        const { clients, } = this;
        if (Array.isArray(clients)) {
          clients.splice(i, 1);
          clients[i].destroySoon();
        }
        break;
      }
    }
    this.outputDistribTopology();
  }

  async addRouter(ip, port) {
    return new Promise((resolve, reject) => {
      const client = net.createConnection(port, ip, () => {
        client.ip = ip;
        client.port = port;
        resolve(client);
      });
      client.on('close', () => {
        const { ip, port, } = client;
        this.removeRouter(ip, port);
      });
      const { routers, clients, } = this;
      routers.push([ip, port]);
      clients.push(client);
    });
    this.checkMemory();
    this.outputDistribTopology();
  }

  checkCombine() {
    const { server, clients, } = this;
    if (server === undefined || clients === undefined) {
      throw new Error('[Error] Distributed node integration is not yet complete.');
    }
  }

  async attachDistrib(location, content) {
    try {
      this.checkCombine();
      this.attach(location, content);
      switch (typeof content) {
        case 'function': {
          const ackPromises = this.getAckPromises((socket) => {
            socket.write(addBufferFlag(1, getBinBuf([0, 1, location, content.toString()])));
          });
          await Promise.all(ackPromises);
          break;
        }
        default: {
          const ackPromises = this.getAckPromises((socket) => {
            socket.write(addBufferFlag(1, getBinBuf([0, 0, location, JSON.stringify(content)])));
          });
          await Promise.all(ackPromises);
        }
      }
      this.outputDistribOperate('attachDistrib', location);
    } catch (error) {
      this.outputDistribOperateError('attachDistrib', [location], error);
    }
  }

  async exchangeDistrib(location1, location2) {
    try {
      this.checkCombine();
      this.exchange(location1, location2);
      const ackPromises = this.getAckPromises((socket) => {
        socket.write(addBufferFlag(1, getBinBuf([1, location1, location2])));
      });
      await Promise.all(ackPromises);
      this.outputDistribOperate('exchangeDistrib', location1);
      this.outputDistribOperate('exchangeDistrib', location2);
    } catch (error) {
      this.outputDistribOperateError('exchangeDistrib', [locaiton1, location2], error);
    }
  }

  async ruinDistrib(location) {
    try {
      this.checkCombine();
      this.ruin(location);
      const ackPromises = this.getAckPromises((socket) => {
        socket.write(addBufferFlag(1, getBinBuf([2, location])));
      });
      await Promise.all(ackPromises);
      this.outputDistribOperate('ruinDistrib', location);
    } catch (error) {
      this.outputDistribOperateError('ruinDistrib', [location], error);
    }
  }

  async ruinAllDistrib(locations) {
    this.checkCombine();
    this.ruinAll(locations);
    const ackPromises = this.getAckPromises((socket) => {
      socket.write(addBufferFlag(1, getBinBuf([3, ...locations])));
    });
    await Promise.all(ackPromises);
  }

  async replaceDistrib(location, multiple) {
    try {
      if (multiple instanceof Thing) {
        throw new Error('[Error] Distributed operations are not easy to transmit');
      }
      const content = multiple;
      this.checkCombine();
      this.replace(location, content);
      switch (typeof content) {
        case 'function': {
          const ackPromises = this.getAckPromises((socket) => {
            socket.write(addBufferFlag(1, getBinBuf([4, 1, location, content.toString()])));
          });
          await Promise.all(ackPromises);
          break;
        }
        default: {
          const ackPromises = this.getAckPromises((socket) => {
            socket.write(addBufferFlag(1, getBinBuf([4, 0, location, JSON.stringify(content)])));
          });
          await Promise.all(ackPromises);
        }
      }
      this.outputDistribOperate('replaceDistrib', location);
    } catch (error) {
      this.outputDistribOperateError('replaceDistrib', [location], error);
    }
  }

  async reviseDistrib(location, content) {
    try {
      this.checkCombine();
      this.revise(location, content);
      switch (typeof content) {
        case 'function': {
          const ackPromises = this.getAckPromises((socket) => {
            socket.write(addBufferFlag(1, getBinBuf([5, 1, location, content.toString()])));
          });
          await Promise.all(ackPromises);
          break;
        }
        default: {
          const ackPromises = this.getAckPromises((socket) => {
            socket.write(addBufferFlag(1, getBinBuf([5, 0, location, JSON.stringify(content)])));
          });
          await Promise.all(ackPromises);
        }
      }
      this.outputDistribOperate('reviseDistrib', location);
    } catch (error) {
      this.outputDistribOperateError('reviseDistrib', [location], error);
    }
  }

  async addSystemNoticeDistrib(phrase, callback) {
    try {
      this.checkCombine();
      this.addSystemNotice(phrase, callback);
      const ackPromises = this.getAckPromises((socket) => {
        socket.write(addBufferFlag(1, getBinBuf([6, phrase, callback.toString()])));
      });
      await Promise.all(ackPromises);
      this.outputDistribFunction('addSystemNotice distrib');
    } catch (error) {
      this.outputDistribFunctionError('addSystemNotice distrib', error);
    }
  }
}

export default DistribRouter;
