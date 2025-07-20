import net from 'net';
import { describe, expect, test, } from '@jest/globals';
import { getOwnIpAddresses, wrapIpv6, } from 'manner.js/server';
import DistribRouter from '~/class/DistribRouter';

describe('[Class] DistribRouter;', () => {
  test('DistribRouter should support ipv4 addresses.', async () => {
    const [ipAddress] = getOwnIpAddresses();
    const { ipv4, } = ipAddress;
    const routers = [
      [ipv4, 8000],
      [ipv4, 8001],
    ];
    const distribRouter1 = new DistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8000, routers);
    const distribRouter2 = new DistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8001, routers);
    expect(JSON.stringify(distribRouter1.routers)).toMatch(JSON.stringify([
      [ipv4, 8001],
    ]));
    expect(JSON.stringify(distribRouter2.routers)).toMatch(JSON.stringify([
      [ipv4, 8000],
    ]));
  });

  test('DistribRouter should support ipv6 addresses.', async () => {
    const [ipAddress] = getOwnIpAddresses();
    const { ipv6, } = ipAddress;
    const routers = [
      [wrapIpv6(ipv6),  8002],
      [wrapIpv6(ipv6),  8003],
    ];
    const distribRouter1 = new DistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8002, routers);
    expect(JSON.stringify(distribRouter1.routers)).toMatch(JSON.stringify([
      [wrapIpv6(ipv6),  8003],
    ]));
    const distribRouter2 = new DistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8003, routers);
    expect(JSON.stringify(distribRouter2.routers)).toMatch(JSON.stringify([
      [wrapIpv6(ipv6),  8002],
    ]));
  });

  test('DistribRouter should be able to support both ipv4 and ipv6 addresses.', async () => {
    const [ipAddress] = getOwnIpAddresses();
    const { ipv4, ipv6, } = ipAddress;
    const routers = [
      [wrapIpv6(ipv6),  8004],
      [ipv4, 8005],
    ];
    const distribRouter1 = new DistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8004, routers);
    expect(JSON.stringify(distribRouter1.routers)).toMatch(JSON.stringify([
      [ipv4, 8005],
    ]));
    const distribRouter2 = new DistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8005, routers);
    expect(JSON.stringify(distribRouter2.routers)).toMatch(JSON.stringify([
      [wrapIpv6(ipv6),  8004],
    ]));
  });

  test('DistribRouter should start normally.', async () => {
    const [ipAddress] = getOwnIpAddresses();
    const { ipv4, ipv6, } = ipAddress;
    let routers = [
      [ipv4, 8006],
      [ipv4, 8007],
    ];
    const distribRouter1 = new DistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8006, routers);
    const distribRouter2 = new DistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8007, routers);
    await DistribRouter.combine([distribRouter1, distribRouter2]);
    expect(distribRouter1.server instanceof net.Server).toBe(true);
    const { clients: clients1, } = distribRouter1;
    for (let i = 0; i < clients1.length; i += 1) {
      const client = clients1[i];
      expect(client instanceof net.Socket).toBe(true);
    }
    expect(distribRouter2.server instanceof net.Server).toBe(true);
    const { clients: clients2, } = distribRouter2;
    for (let i = 0; i < clients2.length; i += 1) {
      const client = clients2[i];
      expect(client instanceof net.Socket).toBe(true);
    }
    await DistribRouter.release([distribRouter1, distribRouter2]);
  });
});
