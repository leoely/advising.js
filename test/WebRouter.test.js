import { describe, expect, test, } from '@jest/globals';
import WebRouter from '~/class/WebRouter';

describe('[Class] WebRouter;', () => {
  test('WebRouter additions require additional support for path variables.', () => {
    const webRouter = new WebRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    webRouter.add('/movie/action//{page}/{index}', ['Thunderbolts', 'Sinners', 'Havoc'], true);
    expect(JSON.stringify(webRouter.root.find('movie').find('action').pathKeys)).toMatch('[\"page\",\"index\"]');
  });

  test('WebRouter nedd to support both query parameters and path variables.', () => {
    const webRouter = new WebRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    webRouter.add('/movie/action//{page}/{index}', ['Thunderbolts', 'Sinners', 'Havoc'], true);
    expect(JSON.stringify(webRouter.match('/movie/action//1/1?k1=v1&k2=v2', false, true, true))).toMatch('{\"content\":[\"Thunderbolts\",\"Sinners\",\"Havoc\"],\"queryParams\":{\"k2\":\"v2\",\"k1\":\"v1k2\"},\"pathVariables\":{\"page\":\"1\",\"index\":\"1\"}}');
  });

  test('WebRouter needs to supports settings path keys.', () => {
    const webRouter = new WebRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    webRouter.add('/movie/action//{page}/{index}', ['Thunderbolts', 'Sinners', 'Havoc'], true);
    webRouter.setPathKeys('/movie/action//{start}/{end}');
    expect(JSON.stringify(webRouter.root.find('movie').find('action').pathKeys)).toMatch('[\"start\",\"end\"]');
  });

  test('WebRouter needs to complete the adaptation of the delete operation..', () => {
    const webRouter = new WebRouter({
      threshold: 0.5,
      number: 4,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    webRouter.add('/male/john', { name: 'john', age: 22, });
    webRouter.add('/male/robert', { name: 'robert', age: 18, });
    webRouter.add('/male/david', { name: 'david', age: 40, });
    expect(JSON.stringify(webRouter.match('/male/john', false, true))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(webRouter.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(webRouter.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    webRouter.delete('/male/john');
    expect(webRouter.root.count).toBe(2);
    webRouter.delete('/male/robert');
    expect(webRouter.root.count).toBe(1);
    expect(webRouter.root.find('male').count).toBe(1);
    expect(() => webRouter.match('/male/john')).toThrow('[Error] Router matching the url does not exist.');
    expect(() => webRouter.match('/male/robert')).toThrow('[Error] Router matching the url does not exist.');
    webRouter.delete('/male/david');
    expect(() => webRouter.match('/male/david')).toThrow('[Error] Cluster hash is empty,please add a route first.');
  });

  test('WebRouter needs to complete the adaptation of the update operation.', () => {
    const webRouter = new WebRouter({
      threshold: 0.5,
      number: 4,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    webRouter.add('/world/male', ['john', 'robert', 'david']);
    expect(JSON.stringify(webRouter.match('/world/male'))).toMatch('[\"john\",\"robert\",\"david\"]');
    webRouter.update('/world/male', ['jason', 'kevin', 'eric']);
    expect(webRouter.root.count).toBe(0);
    expect(JSON.stringify(webRouter.match('/world/male'))).toMatch('[\"jason\",\"kevin\",\"eric\"]');
    expect(() => webRouter.update('/world/female', ['amani', 'tiffany', 'carolyn'])).toThrow('[Error] Router matching the url does not exist.');
  });

  test('WebRouter needs to complete the adaptation of the update operation..', () => {
    const webRouter = new WebRouter({
      threshold: 0.5,
      number: 4,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    webRouter.add('/male/john', { name: 'john', age: 22, });
    webRouter.add('/male/robert', { name: 'robert', age: 18, });
    expect(JSON.stringify(webRouter.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(webRouter.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(webRouter.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    webRouter.swap('/male/john', '/male/robert');
    expect(webRouter.root.find('male').find('john').count).toBe(1);
    expect(webRouter.root.find('male').find('robert').count).toBe(2);
    expect(webRouter.root.find('male').count).toBe(3);
    expect(JSON.stringify(webRouter.match('/male/john'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(webRouter.match('/male/robert'))).toMatch('{\"name\":\"john\",\"age\":22}');
  });

  test('WebRouter should be needs to complete the adaptation of the fix operation..', () => {
    const webRouter = new WebRouter({
      threshold: 0.5,
      number: 4,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    webRouter.add('/male/john', { name: 'robert', age: 18, });
    expect(JSON.stringify(webRouter.match('/male/john'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    webRouter.fix('/male/john', { name: 'john', age: 22, });
    expect(JSON.stringify(webRouter.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(webRouter.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(webRouter.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(webRouter.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(webRouter.root.find('male').find('john').count).toBe(5);
    expect(webRouter.root.find('male').count).toBe(5);
  });
});
