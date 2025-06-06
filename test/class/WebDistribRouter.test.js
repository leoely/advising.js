import net from 'net';
import { describe, expect, test, } from '@jest/globals';
import { getOwnIpAddresses, wrapIpv6, } from 'manner.js/server';
import WebDistribRouter from '~/class/WebDistribRouter';

describe('[Class] WebDistribRouter;', () => {
  test('WebDistribRouter should be added correctly in distributed situations.', async () => {
    const [ipAddress] = getOwnIpAddresses();
    const { ipv4, } = ipAddress;
    const routerArray = [
      [ipv4, 8008],
      [ipv4, 8009],
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

  test('WebDistribRouter should be switched correctly in distributed situations', async () => {
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

  test('WebDistribRouter should be switched correctly in distributed situations', async () => {
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

  test('WebDistribRouter should be switched correctly in distributed situations', async () => {
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
    await webDistribRouter1.ruinAllDistrib(['/male/john', '/male/robert']);
    expect(JSON.stringify(webDistribRouter1.matchInner('/male/john'))).toBe(undefined);
    expect(JSON.stringify(webDistribRouter1.matchInner('/male/robert'))).toBe(undefined);
    expect(JSON.stringify(webDistribRouter2.matchInner('/male/john'))).toBe(undefined);
    expect(JSON.stringify(webDistribRouter2.matchInner('/male/robert'))).toBe(undefined);
    await WebDistribRouter.release([webDistribRouter1, webDistribRouter2]);
  });

  test('WebDistribRouter should be switched correctly in distributed situations', async () => {
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

  test('WebDistribRouter should be switched correctly in distributed situations', async () => {
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
    await webDistribRouter1.reviseDistrib('/male/john', { name: 'david', age: 40 });
    expect(JSON.stringify(webDistribRouter1.matchInner('/male/john'))).toBe('{\"name\":\"david\",\"age\":40}');
    expect(webDistribRouter1.root.find('male').find('john').count).toBe(3);
    expect(JSON.stringify(webDistribRouter1.matchInner('/male/robert'))).toBe('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(webDistribRouter2.matchInner('/male/john'))).toBe('{\"name\":\"david\",\"age\":40}');
    expect(webDistribRouter2.root.find('male').find('john').count).toBe(4);
    expect(JSON.stringify(webDistribRouter2.matchInner('/male/robert'))).toBe('{\"name\":\"robert\",\"age\":18}');
    await WebDistribRouter.release([webDistribRouter1, webDistribRouter2]);
  });
});
