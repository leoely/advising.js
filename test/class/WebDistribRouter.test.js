import timersPromises from 'timers/promises';
import net from 'net';
import { describe, expect, test, } from '@jest/globals';
import { getOwnIpAddresses, wrapIpv6, } from 'manner.js/server';
import WebDistribRouter from '~/class/WebDistribRouter';

describe('[Class] WebDistribRouter;', () => {
  test('WebDistribRouter should be added correctly in distributed situations.', async () => {
    const [ipAddress] = getOwnIpAddresses();
    const { ipv6, } = ipAddress;
    const routerArray = [
      [ipv6, 8008],
      [ipv6, 8009],
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
    }, 8008, routerArray);
    const webDistribRouter2 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8009, routerArray);
    await WebDistribRouter.combine([webDistribRouter1, webDistribRouter2]);
    await webDistribRouter1.attachDistrib('/movie/action//{page}/{index}', ['Thunderbolts', 'Sinners', 'Havoc']);
    expect(JSON.stringify(webDistribRouter1.root.find('movie').find('action').getPathKeys())).toMatch('[\"page\",\"index\"]');
    expect(JSON.stringify(webDistribRouter2.root.find('movie').find('action').getPathKeys())).toMatch('[\"page\",\"index\"]');
    await WebDistribRouter.release([webDistribRouter1, webDistribRouter2]);
  });

  test('WebDistribRouter should be matched correctly in distributed situations', async () => {
    const [ipAddress] = getOwnIpAddresses();
    const { ipv4, } = ipAddress;
    const routerArray = [
      [ipv4, 8010],
      [ipv4, 8011],
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
    }, 8010, routerArray);
    webDistribRouter1.attach('/male/john', { name: 'john', age: 22, });
    webDistribRouter1.attach('/male/robert', { name: 'robert', age: 18, });
    const webDistribRouter2 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8011, routerArray);
    webDistribRouter2.attach('/male/john', { name: 'john', age: 22, });
    webDistribRouter2.attach('/male/robert', { name: 'robert', age: 18, });
    await WebDistribRouter.combine([webDistribRouter1, webDistribRouter2]);
    await webDistribRouter1.exchangeDistrib('/male/john', '/male/robert');
    expect(JSON.stringify(webDistribRouter1.matchInner('/male/john'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(webDistribRouter1.matchInner('/male/robert'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(webDistribRouter2.matchInner('/male/john'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(webDistribRouter2.matchInner('/male/robert'))).toMatch('{\"name\":\"john\",\"age\":22}');
    await WebDistribRouter.release([webDistribRouter1, webDistribRouter2]);
  });

  test('WebDistribRouter should be ruined correctly in distributed situations', async () => {
    const [ipAddress] = getOwnIpAddresses();
    const { ipv4, } = ipAddress;
    const routerArray = [
      [ipv4, 8012],
      [ipv4, 8013],
    ];
    const webDistribRouter1 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    }, 8012, routerArray);
    webDistribRouter1.attach('/male/john', { name: 'john', age: 22, });
    webDistribRouter1.attach('/male/robert', { name: 'robert', age: 18, });
    const webDistribRouter2 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    }, 8013, routerArray);
    webDistribRouter2.attach('/male/john', { name: 'john', age: 22, });
    webDistribRouter2.attach('/male/robert', { name: 'robert', age: 18, });
    await WebDistribRouter.combine([webDistribRouter1, webDistribRouter2]);
    await webDistribRouter1.ruinDistrib('/male/john', '/male/robert');
    expect(JSON.stringify(webDistribRouter1.matchInner('/male/john'))).toBe(undefined);
    expect(JSON.stringify(webDistribRouter1.matchInner('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(webDistribRouter2.matchInner('/male/john'))).toBe(undefined);
    expect(JSON.stringify(webDistribRouter2.matchInner('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    await WebDistribRouter.release([webDistribRouter1, webDistribRouter2]);
  });

  test('WebDistribRouter should be all ruined correctly in distributed situations', async () => {
    const [ipAddress] = getOwnIpAddresses();
    const { ipv4, } = ipAddress;
    const routerArray = [
      [ipv4, 8014],
      [ipv4, 8015],
    ];
    const webDistribRouter1 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    }, 8014, routerArray);
    webDistribRouter1.attach('/male/john', { name: 'john', age: 22, });
    webDistribRouter1.attach('/male/robert', { name: 'robert', age: 18, });
    const webDistribRouter2 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    }, 8015, routerArray);
    webDistribRouter2.attach('/male/john', { name: 'john', age: 22, });
    webDistribRouter2.attach('/male/robert', { name: 'robert', age: 18, });
    await WebDistribRouter.combine([webDistribRouter1, webDistribRouter2]);
    await webDistribRouter1.ruinAllDistrib(['/male/john', '/male/robert']);
    expect(JSON.stringify(webDistribRouter1.matchInner('/male/john'))).toBe(undefined);
    expect(JSON.stringify(webDistribRouter1.matchInner('/male/robert'))).toBe(undefined);
    expect(JSON.stringify(webDistribRouter2.matchInner('/male/john'))).toBe(undefined);
    expect(JSON.stringify(webDistribRouter2.matchInner('/male/robert'))).toBe(undefined);
    await WebDistribRouter.release([webDistribRouter1, webDistribRouter2]);
  });

  test('WebDistribRouter should be replaced correctly in distributed situations', async () => {
    const [ipAddress] = getOwnIpAddresses();
    const { ipv4, } = ipAddress;
    const routerArray = [
      [ipv4, 8016],
      [ipv4, 8017],
    ];
    const webDistribRouter1 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    }, 8016, routerArray);
    webDistribRouter1.attach('/male/john', { name: 'john', age: 22, });
    webDistribRouter1.attach('/male/robert', { name: 'robert', age: 18, });
    const webDistribRouter2 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    }, 8017, routerArray);
    webDistribRouter2.attach('/male/john', { name: 'john', age: 22, });
    webDistribRouter2.attach('/male/robert', { name: 'robert', age: 18, });
    webDistribRouter1.gain('/male/john');
    webDistribRouter1.gain('/male/john');
    webDistribRouter2.gain('/male/john');
    webDistribRouter2.gain('/male/john');
    webDistribRouter2.gain('/male/john');
    await WebDistribRouter.combine([webDistribRouter1, webDistribRouter2]);
    await webDistribRouter1.replaceDistrib('/male/john', { name: 'david', age: 40 });
    expect(JSON.stringify(webDistribRouter1.matchInner('/male/john'))).toBe('{\"name\":\"david\",\"age\":40}');
    expect(webDistribRouter1.root.find('male').find('john').count).toBe(1);
    expect(JSON.stringify(webDistribRouter1.matchInner('/male/robert'))).toBe('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(webDistribRouter2.matchInner('/male/john'))).toBe('{\"name\":\"david\",\"age\":40}');
    expect(webDistribRouter2.root.find('male').find('john').count).toBe(1);
    expect(JSON.stringify(webDistribRouter2.matchInner('/male/robert'))).toBe('{\"name\":\"robert\",\"age\":18}');
    await WebDistribRouter.release([webDistribRouter1, webDistribRouter2]);
  });

  test('WebDistribRouter should be reivseed correctly in distributed situations', async () => {
    const [ipAddress] = getOwnIpAddresses();
    const { ipv4, } = ipAddress;
    const routerArray = [
      [ipv4, 8018],
      [ipv4, 8019],
    ];
    const webDistribRouter1 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    }, 8018, routerArray);
    webDistribRouter1.attach('/male/john', { name: 'john', age: 22, });
    webDistribRouter1.attach('/male/robert', { name: 'robert', age: 18, });
    const webDistribRouter2 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    }, 8019, routerArray);
    webDistribRouter2.attach('/male/john', { name: 'john', age: 22, });
    webDistribRouter2.attach('/male/robert', { name: 'robert', age: 18, });
    webDistribRouter1.gain('/male/john');
    webDistribRouter1.gain('/male/john');
    webDistribRouter2.gain('/male/john');
    webDistribRouter2.gain('/male/john');
    webDistribRouter2.gain('/male/john');
    await WebDistribRouter.combine([webDistribRouter1, webDistribRouter2]);
    await webDistribRouter1.reviseDistrib('/male/john', { name: 'david', age: 40 });
    expect(JSON.stringify(webDistribRouter1.matchInner('/male/john'))).toBe('{\"name\":\"david\",\"age\":40}');
    expect(webDistribRouter1.root.find('male').find('john').count).toBe(3);
    expect(JSON.stringify(webDistribRouter1.matchInner('/male/robert'))).toBe('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(webDistribRouter2.matchInner('/male/john'))).toBe('{\"name\":\"david\",\"age\":40}');
    expect(webDistribRouter2.root.find('male').find('john').count).toBe(4);
    expect(JSON.stringify(webDistribRouter2.matchInner('/male/robert'))).toBe('{\"name\":\"robert\",\"age\":18}');
    await WebDistribRouter.release([webDistribRouter1, webDistribRouter2]);
  });

  test('DistribRouter should be able to be added correctly.', async () => {
    const [ipAddress] = getOwnIpAddresses();
    const { ipv4, ipv6, } = ipAddress;
    let routers = [
      [ipv4, 8020],
      [ipv4, 8021],
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
    }, 8020, routers);
    const webDistribRouter2 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8021, routers);
    await WebDistribRouter.combine([webDistribRouter1, webDistribRouter2]);
    await webDistribRouter2.attachDistrib('/male/john', { name: 'john', age: 22, });
    expect(JSON.stringify(webDistribRouter1.matchInner('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(webDistribRouter2.matchInner('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    let newRouters = [
      [ipv4, 8020],
      [ipv4, 8021],
      [ipv4, 8022],
    ];
    const webDistribRouter3 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8022, newRouters);
    await WebDistribRouter.join([webDistribRouter3], [webDistribRouter1, webDistribRouter2], newRouters);
    await webDistribRouter3.attachDistrib('/male/robert', { name: 'robert', age: 18, });
    expect(JSON.stringify(webDistribRouter1.matchInner('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(webDistribRouter2.matchInner('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(webDistribRouter3.matchInner('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    await webDistribRouter1.attachDistrib('/female/ada', { name: 'ada', age: 25, });
    expect(JSON.stringify(webDistribRouter1.matchInner('/female/ada'))).toMatch('{\"name\":\"ada\",\"age\":25}');
    expect(JSON.stringify(webDistribRouter2.matchInner('/female/ada'))).toMatch('{\"name\":\"ada\",\"age\":25}');
    expect(JSON.stringify(webDistribRouter3.matchInner('/female/ada'))).toMatch('{\"name\":\"ada\",\"age\":25}');
    await WebDistribRouter.release([webDistribRouter1, webDistribRouter2, webDistribRouter3]);
  });

  test('WebDistribRouter addSystemNoticeDistrib should handle their respective scope data.', async () => {
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
    webDistribRouter1.setTemporaryMemorySwitch(true);
    webDistribRouter2.setTemporaryMemorySwitch(true);
    await WebDistribRouter.combine([webDistribRouter1, webDistribRouter2]);
    await webDistribRouter2.addSystemNoticeDistrib('mem>chk', (global) => {
      if (global !== undefined) {
        global.value1 += 1;
      }
    });
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

  test('WebDistribRouter should be able to be deleted correctly.', async () => {
    const [ipAddress] = getOwnIpAddresses();
    const { ipv4, ipv6, } = ipAddress;
    let routers = [
      [ipv4, 8025],
      [ipv4, 8026],
      [ipv4, 8027],
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
    }, 8025, routers);
    const webDistribRouter2 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8026, routers);
    const webDistribRouter3 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8027, routers);
    await WebDistribRouter.combine([webDistribRouter1, webDistribRouter2, webDistribRouter3]);
    await webDistribRouter2.close();
    expect(JSON.stringify(webDistribRouter1.routers)).toMatch(`[[\"${ipv4}\",8027,2]]`);
    expect(JSON.stringify(webDistribRouter3.routers)).toMatch(`[[\"${ipv4}\",8025,0]]`);
    await webDistribRouter3.attachDistrib('/operation/simulation', { operation: 'simulation', });
    expect(JSON.stringify(webDistribRouter1.gain('/operation/simulation'))).toMatch('{\"content\":{\"operation\":\"simulation\"},\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter3.gain('/operation/simulation'))).toMatch('{\"content\":{\"operation\":\"simulation\"},\"queryParams\":{},\"pathVariables\":{}}');
    await WebDistribRouter.release([webDistribRouter1, webDistribRouter3]);
  });

  test('WebDistribRouter should be able to display the processed keys.', async () => {
    const [ipAddress] = getOwnIpAddresses();
    const { ipv4, ipv6, } = ipAddress;
    let routers = [
      [ipv4, 8028],
      [ipv4, 8029],
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
    }, 8028, routers);
    const webDistribRouter2 = new WebDistribRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    }, 8029, routers);
    await WebDistribRouter.combine([webDistribRouter1, webDistribRouter2]);
    await webDistribRouter1.attachDistrib('/someone/tim', { name: 'tim', });
    await webDistribRouter2.attachDistrib('/jack', { name: 'jack', });
    await webDistribRouter1.attachDistrib('/before/anyone/angie', { name: 'angie', });
    expect(JSON.stringify(webDistribRouter1.gain('/jack'))).toMatch('{\"content\":{\"name\":\"jack\"},\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter1.gain('/jack'))).toMatch('{\"content\":{\"name\":\"jack\"},\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter1.gain('/someone/tim'))).toMatch('{\"content\":{\"name\":\"tim\"},\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter2.gain('/someone/tim'))).toMatch('{\"content\":{\"name\":\"tim\"},\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter1.gain('/someone/tim'))).toMatch('{\"content\":{\"name\":\"tim\"},\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter2.gain('/someone/tim'))).toMatch('{\"content\":{\"name\":\"tim\"},\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter1.gain('/before/anyone/angie'))).toMatch('{\"content\":{\"name\":\"angie\"},\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter2.gain('/before/anyone/angie'))).toMatch('{\"content\":{\"name\":\"angie\"},\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter1.gain('/before/anyone/angie'))).toMatch('{\"content\":{\"name\":\"angie\"},\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter2.gain('/before/anyone/angie'))).toMatch('{\"content\":{\"name\":\"angie\"},\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter1.gain('/before/anyone/angie'))).toMatch('{\"content\":{\"name\":\"angie\"},\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter2.gain('/before/anyone/angie'))).toMatch('{\"content\":{\"name\":\"angie\"},\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter1.gain('/before/anyone/angie'))).toMatch('{\"content\":{\"name\":\"angie\"},\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter2.gain('/before/anyone/angie'))).toMatch('{\"content\":{\"name\":\"angie\"},\"queryParams\":{},\"pathVariables\":{}}');
    expect(JSON.stringify(webDistribRouter1.keys())).toMatch('[\"someone/tim\",\"jack\",\"before/anyone/angie\"]');
    expect(JSON.stringify(webDistribRouter2.keys())).toMatch('[\"someone/tim\",\"jack\",\"before/anyone/angie\"]');
    await WebDistribRouter.release([webDistribRouter1, webDistribRouter2]);
  });
});
