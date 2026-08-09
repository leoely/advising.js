import { describe, expect, test, } from '@jest/globals';
import HostRouter from '~/class/HostRouter';

describe('[Class] HostRouter;', () => {
  test('HostRouter should be able to support various hostname.', () => {
    const hostRouter = new HostRouter({
      threshold: 0.5,
      number: 10,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    hostRouter.attach('www-mstr-1.manner.com:80', { host: 'www-mstr-1.manner.com:80', });
    hostRouter.attach('www-slv-1.manner.io:1024', { host: 'www-slv-1.manner.io:1024', });
    expect(JSON.stringify(hostRouter.gain('www-mstr-1.manner.com:80'))).toMatch('{\"host\":\"www-mstr-1.manner.com:80\"}');
    expect(JSON.stringify(hostRouter.gain('www-slv-1.manner.io:1024'))).toMatch('{\"host\":\"www-slv-1.manner.io:1024\"}');
    hostRouter.attach('www-slv-2.manner.io:80', { host: 'www-slv-2.manner.io:80', });
    expect(JSON.stringify(hostRouter.gain('www-slv-2.manner.io:80'))).toMatch('{\"host\":\"www-slv-2.manner.io:80\"}');
    expect(JSON.stringify(hostRouter.gain('www-slv-2.manner.io:80'))).toMatch('{\"host\":\"www-slv-2.manner.io:80\"}');
    expect(JSON.stringify(hostRouter.gain('www-slv-2.manner.io:80'))).toMatch('{\"host\":\"www-slv-2.manner.io:80\"}');
    expect(JSON.stringify(hostRouter.gain('www-slv-2.manner.io:80'))).toMatch('{\"host\":\"www-slv-2.manner.io:80\"}');
    hostRouter.attach('www-slv-2.manner.io:1024', { host: 'www-slv-2.manner.io:1024', });
    expect(JSON.stringify(hostRouter.gain('www-slv-1.manner.io:1024'))).toMatch('{\"host\":\"www-slv-1.manner.io:1024\"}');
    expect(JSON.stringify(hostRouter.gain('www-slv-1.manner.io:1024'))).toMatch('{\"host\":\"www-slv-1.manner.io:1024\"}');
    hostRouter.attach('www-slv-1.manner.io:1025', { host: 'www-slv-1.manner.io:1025', });
    expect(JSON.stringify(hostRouter.gain('www-slv-1.manner.io:1025'))).toMatch('{\"host\":\"www-slv-1.manner.io:1025\"}');
    expect(JSON.stringify(hostRouter.gain('www-slv-1.manner.io:1025'))).toMatch('{\"host\":\"www-slv-1.manner.io:1025\"}');
    expect(JSON.stringify(hostRouter.gain('www-slv-1.manner.io:1025'))).toMatch('{\"host\":\"www-slv-1.manner.io:1025\"}');
  });

  test('HostRouter should be able to support various ipv4 address.', () => {
    const hostRouter = new HostRouter({
      threshold: 0.5,
      number: 10,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    hostRouter.attach('192.168.1.1:80', { host: '192.168.1.2:80', });
    hostRouter.attach('192.168.1.2:1024', { host: '192.168.1.2:1024', });
    expect(JSON.stringify(hostRouter.gain('192.168.1.1:80'))).toMatch('{\"host\":\"192.168.1.2:80\"}');
    expect(JSON.stringify(hostRouter.gain('192.168.1.2:1024'))).toMatch('{\"host\":\"192.168.1.2:1024\"}');
    hostRouter.attach('192.168.1.2:1025', { host: '192.168.1.2:1025', });
    expect(JSON.stringify(hostRouter.gain('192.168.1.2:1025'))).toMatch('{\"host\":\"192.168.1.2:1025\"}');
    expect(JSON.stringify(hostRouter.gain('192.168.1.2:1025'))).toMatch('{\"host\":\"192.168.1.2:1025\"}');
    expect(JSON.stringify(hostRouter.gain('192.168.1.2:1025'))).toMatch('{\"host\":\"192.168.1.2:1025\"}');
    expect(JSON.stringify(hostRouter.gain('192.168.1.2:1025'))).toMatch('{\"host\":\"192.168.1.2:1025\"}');
    expect(JSON.stringify(hostRouter.gain('192.168.1.2:1025'))).toMatch('{\"host\":\"192.168.1.2:1025\"}');
    hostRouter.attach('192.168.1.2:1026', { host: '192.168.1.2:1026', });
    hostRouter.attach('192.168.1.3:1024', { host: '192.168.1.3:1024', });
    expect(JSON.stringify(hostRouter.gain('192.168.1.2:1026'))).toMatch('{\"host\":\"192.168.1.2:1026\"}');
    expect(JSON.stringify(hostRouter.gain('192.168.1.3:1024'))).toMatch('{\"host\":\"192.168.1.3:1024\"}');
    hostRouter.attach('127.0.0.1:1024', { host: '127.0.0.1:1024', });
    expect(JSON.stringify(hostRouter.gain('127.0.0.1:1024'))).toMatch('{\"host\":\"127.0.0.1:1024\"}');
  });

  test('HostRouter should be able to support various ipv6 address.', () => {
    const hostRouter = new HostRouter({
      threshold: 0.5,
      number: 10,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    hostRouter.attach('[2001:0db8:85a3:0000:0000:8a2e:0370:7334]:80', { host: '[2001:0db8:85a3:0000:0000:8a2e:0370:7334]:80', });
    hostRouter.attach('[fe00:0000:0000:0001:0000:0000:0000:0092]:1024', { host: '[fe00:0000:0000:0001:0000:0000:0000:0092]:1024', });
    expect(JSON.stringify(hostRouter.gain('[2001:0db8:85a3:0000:0000:8a2e:0370:7334]:80'))).toMatch('{\"host\":\"[2001:0db8:85a3:0000:0000:8a2e:0370:7334]:80\"}');
    expect(JSON.stringify(hostRouter.gain('[fe00:0000:0000:0001:0000:0000:0000:0092]:1024'))).toMatch('{\"host\":\"[fe00:0000:0000:0001:0000:0000:0000:0092]:1024\"}');
    hostRouter.attach('[0001:0002:0003:0000:0000:1023:0000:0022]:1025', { host: '[0001:0002:0003:0000:0000:1023:0000:0022]:1025', });
    expect(JSON.stringify(hostRouter.gain('[0001:0002:0003:0000:0000:1023:0000:0022]:1025'))).toMatch('{\"host\":\"[0001:0002:0003:0000:0000:1023:0000:0022]:1025\"}');
    expect(JSON.stringify(hostRouter.gain('[0001:0002:0003:0000:0000:1023:0000:0022]:1025'))).toMatch('{\"host\":\"[0001:0002:0003:0000:0000:1023:0000:0022]:1025\"}');
    expect(JSON.stringify(hostRouter.gain('[0001:0002:0003:0000:0000:1023:0000:0022]:1025'))).toMatch('{\"host\":\"[0001:0002:0003:0000:0000:1023:0000:0022]:1025\"}');
    expect(JSON.stringify(hostRouter.gain('[0001:0002:0003:0000:0000:1023:0000:0022]:1025'))).toMatch('{\"host\":\"[0001:0002:0003:0000:0000:1023:0000:0022]:1025\"}');
    expect(JSON.stringify(hostRouter.gain('[0001:0002:0003:0000:0000:1023:0000:0022]:1025'))).toMatch('{\"host\":\"[0001:0002:0003:0000:0000:1023:0000:0022]:1025\"}');
    expect(JSON.stringify(hostRouter.gain('[0001:0002:0003:0000:0000:1023:0000:0022]:1025'))).toMatch('{\"host\":\"[0001:0002:0003:0000:0000:1023:0000:0022]:1025\"}');
    expect(JSON.stringify(hostRouter.gain('[0001:0002:0003:0000:0000:1023:0000:0022]:1025'))).toMatch('{\"host\":\"[0001:0002:0003:0000:0000:1023:0000:0022]:1025\"}');
    hostRouter.attach('[ffee:0000:0000:0001:0000:0000:0000:0001]:1026', { host: '[ffee:0000:0000:0001:0000:0000:0000:0001]:1026', });
    hostRouter.attach('[2001:0db8:0000:0000:0000:0000:0000:0001]:1024', { host: '[2001:0db8:0000:0000:0000:0000:0000:0001]:1024', });
    expect(JSON.stringify(hostRouter.gain('[ffee:0000:0000:0001:0000:0000:0000:0001]:1026'))).toMatch('{\"host\":\"[ffee:0000:0000:0001:0000:0000:0000:0001]:1026\"}');
    expect(JSON.stringify(hostRouter.gain('[2001:0db8:0000:0000:0000:0000:0000:0001]:1024'))).toMatch('{\"host\":\"[2001:0db8:0000:0000:0000:0000:0000:0001]:1024\"}');
  });
});
