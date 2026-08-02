import net from 'net';
import { describe, expect, test, } from '@jest/globals';
import { getOwnIpAddresses, } from 'manner.js/server';
import WebDistribRouter from '~/class/WebDistribRouter';

describe('[Class] AddSystemNotice;', () => {
  test('AddSystemNoticeDistrib should handle their respective scope data.', async () => {
    const [ipAddress] = getOwnIpAddresses();
    const { ipv6, } = ipAddress;
    const routerArray = [
      [ipv6, 8023],
      [ipv6, 8024],
    ];
    const webDistribRouter1 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8023, routerArray);
    const webDistribRouter2 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8024, routerArray);
    const global1 = {
      value1: 10,
      value2: 10,
    };
    webDistribRouter1.setGlobal(global1);
    const global2 = {
      value1: 20,
      value2: 20,
    }
    webDistribRouter2.setGlobal(global2);
    await WebDistribRouter.combine([webDistribRouter1, webDistribRouter2]);
    await webDistribRouter2.addSystemNoticeDistrib('mem>chk', (global) => {
      if (global !== undefined) {
        global.value1 += 1;
      }
    });
    webDistribRouter1.setTemporaryMemorySwitch(true);
    webDistribRouter2.setTemporaryMemorySwitch(true);
    await webDistribRouter1.attachDistrib('/personnel/maintain', ['Aubrey', 'Jackie']);
    expect(global1.value1).toBe(11);
    expect(global2.value1).toBe(21);
    await webDistribRouter2.addSystemNoticeDistrib('mem>chk', (global) => {
      if (global !== undefined) {
        global.value2 += 1;
      }
    });
    expect(JSON.stringify(webDistribRouter1.gain('/personnel/maintain'))).toMatch('{\"content\":[\"Aubrey\",\"Jackie\"],\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter2.gain('/personnel/maintain'))).toMatch('{\"content\":[\"Aubrey\",\"Jackie\"],\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter2.gain('/personnel/maintain'))).toMatch('{\"content\":[\"Aubrey\",\"Jackie\"],\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter2.gain('/personnel/maintain'))).toMatch('{\"content\":[\"Aubrey\",\"Jackie\"],\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter2.gain('/personnel/maintain'))).toMatch('{\"content\":[\"Aubrey\",\"Jackie\"],\"queryParams\":{},\"pathVariables\":{}}');
    expect(global1.value2).toBe(11);
    expect(global2.value2).toBe(21);
    await WebDistribRouter.release([webDistribRouter1, webDistribRouter2]);
  });
});
