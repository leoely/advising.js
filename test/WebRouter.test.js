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
    webRouter.add('/movie/action//{page}/{index}', ['Thunderbolts', 'Sinners', 'Havoc']);
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
    webRouter.add('/movie/action//{page}/{index}', ['Thunderbolts', 'Sinners', 'Havoc']);
    expect(JSON.stringify(webRouter.matchHigh('/movie/action//1/1?k1=v1&k2=v2'))).toMatch('{\"content\":[\"Thunderbolts\",\"Sinners\",\"Havoc\"],\"queryParams\":{\"k2\":\"v2\",\"k1\":\"v1\"},\"pathVariables\":{\"page\":\"1\",\"index\":\"1\"}}');
  });

  test('WebRouter should be able to adpat to URL parameters.', () => {
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
    webRouter.add('/movie/action//{page}/{index}', ['Thunderbolts', 'Sinners', 'Havoc']);
    expect(JSON.stringify(webRouter.matchHigh('/movie/action//1/1'))).toMatch('{\"content\":[\"Thunderbolts\",\"Sinners\",\"Havoc\"],\"queryParams\":{},\"pathVariables\":{\"page\":\"1\",\"index\":\"1\"}}');
    expect(JSON.stringify(webRouter.matchHigh('/movie/action?k1=v1&k2=v2'))).toMatch('{\"content\":[\"Thunderbolts\",\"Sinners\",\"Havoc\"],\"queryParams\":{\"k2\":\"v2\",\"k1\":\"v1\"},\"pathVariables\":{}}');
    expect(JSON.stringify(webRouter.matchHigh('/movie/action'))).toMatch('{\"content\":[\"Thunderbolts\",\"Sinners\",\"Havoc\"],\"queryParams\":{},\"pathVariables\":{}}');
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
    webRouter.add('/movie/action//{page}/{index}', ['Thunderbolts', 'Sinners', 'Havoc']);
    webRouter.setPathKeys('/movie/action//{start}/{end}');
    expect(JSON.stringify(webRouter.root.find('movie').find('action').pathKeys)).toMatch('[\"start\",\"end\"]');
  });

  test('WebRouter needs to complete the adaptation of the delete operation.', () => {
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
    expect(JSON.stringify(webRouter.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
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

  test('WebRouter should be needs to complete the adaptation of the fix operation.', () => {
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

  test('WebRouter should adapt the delete method along with the URL paramter.', () => {
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
    webRouter.add('/male/john//{belongings}', { name: 'john', age: 22, }, true);
    webRouter.add('/male/robert//{belongings}', { name: 'robert', age: 18, },true);
    webRouter.add('/male/david//{belongings}', { name: 'david', age: 40, }, true);
    expect(JSON.stringify(webRouter.matchHigh('/male/john//hat'))).toMatch('{\"content\":{\"name\":\"john\",\"age\":22},\"queryParams\":{},\"pathVariables\":{\"belongings\":\"hat\"}}');
    expect(JSON.stringify(webRouter.matchHigh('/male/robert//hat'))).toMatch('{\"content\":{\"name\":\"robert\",\"age\":18},\"queryParams\":{},\"pathVariables\":{\"belongings\":\"hat\"}}');
    expect(JSON.stringify(webRouter.matchHigh('/male/david//hat'))).toMatch('{\"content\":{\"name\":\"david\",\"age\":40},\"queryParams\":{},\"pathVariables\":{\"belongings\":\"hat\"}}');
    webRouter.delete('/male/john');
    expect(webRouter.root.count).toBe(2);
    webRouter.delete('/male/robert');
    expect(webRouter.root.count).toBe(1);
    expect(webRouter.root.find('male').count).toBe(1);
    expect(() => webRouter.matchHigh('/male/john//hat')).toThrow('[Error] Router matching the url does not exist.');
    expect(() => webRouter.matchHigh('/male/robert//hat')).toThrow('[Error] Router matching the url does not exist.');
    webRouter.delete('/male/david');
    expect(() => webRouter.matchHigh('/male/david//hat')).toThrow('[Error] Cluster hash is empty,please add a route first.');
  });

  test('WebRouter should adapt the update method along with the URL parameters.', () => {
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
    webRouter.add('/world/male//{belongings}', ['john', 'robert', 'david'], true);
    expect(JSON.stringify(webRouter.matchHigh('/world/male//hat'))).toMatch('{\"content\":[\"john\",\"robert\",\"david\"],\"queryParams\":{},\"pathVariables\":{\"belongings\":\"hat\"}}');
    webRouter.update('/world/male//{belongings}', ['jason', 'kevin', 'eric']);
    expect(webRouter.root.count).toBe(0);
    expect(JSON.stringify(webRouter.matchHigh('/world/male//hat'))).toMatch('{\"content\":[\"jason\",\"kevin\",\"eric\"],\"queryParams\":{},\"pathVariables\":{\"belongings\":\"hat\"}}');
    expect(() => webRouter.update('/world/female', ['amani', 'tiffany', 'carolyn'])).toThrow('[Error] Router matching the url does not exist.');
  });

  test('WebRouter should adapt the update method along with the URL parameters.', () => {
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
    webRouter.add('/male/john//{belongings}', { name: 'john', age: 22, });
    webRouter.add('/male/robert//{belongings}', { name: 'robert', age: 18, });
    expect(JSON.stringify(webRouter.matchHigh('/male/john//hat'))).toMatch('{\"content\":{\"name\":\"john\",\"age\":22},\"queryParams\":{},\"pathVariables\":{\"belongings\":\"hat\"}}');
    expect(JSON.stringify(webRouter.matchHigh('/male/john//hat'))).toMatch('{\"content\":{\"name\":\"john\",\"age\":22},\"queryParams\":{},\"pathVariables\":{\"belongings\":\"hat\"}}');
    expect(JSON.stringify(webRouter.matchHigh('/male/robert//hat'))).toMatch('{\"content\":{\"name\":\"robert\",\"age\":18},\"queryParams\":{},\"pathVariables\":{\"belongings\":\"hat\"}}');
    webRouter.swap('/male/john', '/male/robert');
    expect(webRouter.root.find('male').find('john').count).toBe(1);
    expect(webRouter.root.find('male').find('robert').count).toBe(2);
    expect(webRouter.root.find('male').count).toBe(3);
    expect(JSON.stringify(webRouter.matchHigh('/male/john//hat'))).toMatch('{\"content\":{\"name\":\"robert\",\"age\":18},\"queryParams\":{},\"pathVariables\":{\"belongings\":\"hat\"}}');
    expect(JSON.stringify(webRouter.matchHigh('/male/robert//hat'))).toMatch('{\"content\":{\"name\":\"john\",\"age\":22},\"queryParams\":{},\"pathVariables\":{\"belongings\":\"hat\"}}');
  });

  test('WebRouter should adpat the fix method along with the URL parameters.', () => {
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
    webRouter.add('/male/john//{belongings}', { name: 'robert', age: 18, });
    expect(JSON.stringify(webRouter.matchHigh('/male/john//hat'))).toMatch('{\"content\":{\"name\":\"robert\",\"age\":18},\"queryParams\":{},\"pathVariables\":{\"belongings\":\"hat\"}}');
    webRouter.fix('/male/john', { name: 'john', age: 22, });
    expect(JSON.stringify(webRouter.matchHigh('/male/john//hat'))).toMatch('{\"content\":{\"name\":\"john\",\"age\":22},\"queryParams\":{},\"pathVariables\":{\"belongings\":\"hat\"}}');
    expect(JSON.stringify(webRouter.matchHigh('/male/john//hat'))).toMatch('{\"content\":{\"name\":\"john\",\"age\":22},\"queryParams\":{},\"pathVariables\":{\"belongings\":\"hat\"}}');
    expect(JSON.stringify(webRouter.matchHigh('/male/john//hat'))).toMatch('{\"content\":{\"name\":\"john\",\"age\":22},\"queryParams\":{},\"pathVariables\":{\"belongings\":\"hat\"}}');
    expect(JSON.stringify(webRouter.matchHigh('/male/john//hat'))).toMatch('{\"content\":{\"name\":\"john\",\"age\":22},\"queryParams\":{},\"pathVariables\":{\"belongings\":\"hat\"}}');
    expect(webRouter.root.find('male').find('john').count).toBe(5);
    expect(webRouter.root.find('male').count).toBe(5);
  });
});
