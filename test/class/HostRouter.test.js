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
});
