import { describe, expect, test, } from '@jest/globals';
import Ipv6Router from '~/class/Ipv6Router';

describe('[Class] Ipv6Router;', () => {
  test('Ipv6Router should be able to obtain corresponding things.', () => {
    const ipv6Router = new Ipv6Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
      hideError: true,
    });
    ipv6Router.attach('2001:db8:0:1:1:1:1:1', { ip: '2001:db8:0:1:1:1:1:1', time: 23, });
    ipv6Router.attach('1050:0000:0000:0000:0005:0600:300c:326b', { ip: '1050:0000:0000:0000:0005:0600:300c:326b', time: 52, });
    expect(JSON.stringify(ipv6Router.gain('2001:db8:0:1:1:1:1:1'))).toMatch('{\"ip\":\"2001:db8:0:1:1:1:1:1\",\"time\":23}');
    expect(JSON.stringify(ipv6Router.gain('1050:0000:0000:0000:0005:0600:300c:326b'))).toMatch('{\"ip\":\"1050:0000:0000:0000:0005:0600:300c:326b\",\"time\":52}');
    expect(JSON.stringify(ipv6Router.gain('1050:0000:0000:0000:0005:0600:300c:326b'))).toMatch('{\"ip\":\"1050:0000:0000:0000:0005:0600:300c:326b\",\"time\":52}');
    ipv6Router.attach('2001:0db8:85a3:0000:0000:8a2e:0370:7334', { ip: '2001:0db8:85a3:0000:0000:8a2e:0370:7334', time: 68, });
    expect(JSON.stringify(ipv6Router.gain('2001:0db8:85a3:0000:0000:8a2e:0370:7334'))).toMatch('{\"ip\":\"2001:0db8:85a3:0000:0000:8a2e:0370:7334\",\"time\":68}');
    expect(JSON.stringify(ipv6Router.gain('1050:0000:0000:0000:0005:0600:300c:326b'))).toMatch('{\"ip\":\"1050:0000:0000:0000:0005:0600:300c:326b\",\"time\":52}');
    expect(JSON.stringify(ipv6Router.gain('1050:0000:0000:0000:0005:0600:300c:326b'))).toMatch('{\"ip\":\"1050:0000:0000:0000:0005:0600:300c:326b\",\"time\":52}');
    expect(JSON.stringify(ipv6Router.gain('1050:0000:0000:0000:0005:0600:300c:326b'))).toMatch('{\"ip\":\"1050:0000:0000:0000:0005:0600:300c:326b\",\"time\":52}');
    ipv6Router.ruin('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
    expect(ipv6Router.gain('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(undefined);
    ipv6Router.attach('2001:db8:0:1:1:1:1:1', { ip: '2001:db8:0:1:1:1:1:1', time: 23, });
    ipv6Router.attach('::1', { ip: '::1', time: 67, });
    expect(JSON.stringify(ipv6Router.gain('::1'))).toMatch('{\"ip\":\"::1\",\"time\":67}');
  });
});
