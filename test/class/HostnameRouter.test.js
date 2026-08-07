import { describe, expect, test, } from '@jest/globals';
import HostnameRouter from '~/class/HostnameRouter';

describe('[Class] HostnameRouter;', () => {
  test('HostnameRouter should be able to support various hostname.', () => {
    const hostnameRouter = new HostnameRouter({
      threshold: 0.5,
      number: 10,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    hostnameRouter.attach('www-mstr-1.manner.com', { ip: '192.168.1.1', });
    hostnameRouter.attach('www-slv-1.manner.com', { ip: '192.168.1.2', });
    expect(JSON.stringify(hostnameRouter.gain('www-mstr-1.manner.com'))).toMatch('{\"ip\":\"192.168.1.1\"}');
    expect(JSON.stringify(hostnameRouter.gain('www-slv-1.manner.com'))).toMatch('{\"ip\":\"192.168.1.2\"}');
    hostnameRouter.attach('www-slv-2.manner.io', { ip: '192.168.1.3', });
    expect(JSON.stringify(hostnameRouter.gain('www-slv-2.manner.io'))).toMatch('{\"ip\":\"192.168.1.3\"}');
    hostnameRouter.attach('mail-mstr-1.advising.io', { ip: '192.168.1.4', });
    expect(JSON.stringify(hostnameRouter.gain('mail-mstr-1.advising.io'))).toMatch('{\"ip\":\"192.168.1.4\"}');
    expect(JSON.stringify(hostnameRouter.gain('mail-mstr-1.advising.io'))).toMatch('{\"ip\":\"192.168.1.4\"}');
    expect(JSON.stringify(hostnameRouter.gain('mail-mstr-1.advising.io'))).toMatch('{\"ip\":\"192.168.1.4\"}');
    expect(JSON.stringify(hostnameRouter.gain('mail-mstr-1.advising.io'))).toMatch('{\"ip\":\"192.168.1.4\"}');
    expect(JSON.stringify(hostnameRouter.gain('www-slv-1.manner.com'))).toMatch('{\"ip\":\"192.168.1.2\"}');
    expect(JSON.stringify(hostnameRouter.gain('www-slv-1.manner.com'))).toMatch('{\"ip\":\"192.168.1.2\"}');
    expect(JSON.stringify(hostnameRouter.gain('www-slv-1.manner.com'))).toMatch('{\"ip\":\"192.168.1.2\"}');
    expect(JSON.stringify(hostnameRouter.gain('www-slv-1.manner.com'))).toMatch('{\"ip\":\"192.168.1.2\"}');
  });
});
