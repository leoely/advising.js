import { describe, expect, test, } from '@jest/globals';
import Ipv4Router from '~/class/Ipv4Router';

describe('[Class] Ipv4Router;', () => {
  test('Ipv4Router should be able to obtain corresponding things..', () => {
    const ipv4Router = new Ipv4Router({
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
    ipv4Router.attach('192.168.1.7', { ip: '192.168.1.7', time: 10, });
    ipv4Router.ruin('192.168.1.7');
    ipv4Router.attach('46.82.174.69', { ip: '46.82.174.69', time: 4235243, });
    expect(ipv4Router.gain('192.168.1.7')).toBe(undefined);
    expect(JSON.stringify(ipv4Router.gain('46.82.174.69'))).toMatch('{\"ip\":\"46.82.174.69\",\"time\":4235243}');
  });
});
