import { describe, expect, test, } from '@jest/globals';
import Router from '~/class/Router';

describe('[class] Router', () => {
  test('Router match result should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      bond: 5,
      logLevel: 3,
      logInterval: 5,
      logPath: '/tmp/log/'
    });
    router.add('/male/john', { name: 'john', age: 22, });
    router.add('/male/robert', { name: 'robert', age: 18, });
    router.add('/male/david', { name: 'david', age: 40, });
    router.add('/male', ['john', 'robert', 'david']);
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male'))).toMatch('[\"john\",\"robert\",\"david\"]');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
  });

  test('Router mixture generate result should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      bond: 5,
      logLevel: 3,
      logInterval: 5,
      logPath: '/tmp/log/'
    });
    router.add('/male', ['john', 'robert', 'david']);
    router.add('/male/john', { name: 'john', age: 22, });
    router.add('/male/robert', { name: 'robert', age: 18, });
    router.add('/male/david', { name: 'david', age: 40, });
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male'))).toMatch('[\"john\",\"robert\",\"david\"]');
  });

  test('Router should support pure number and letter formate.', () => {
    const router = new Router({
      threshold: 0.5,
      bond: 5,
      logLevel: 3,
      logInterval: 5,
      logPath: '/tmp/log/'
    });
    router.add('/male/john', { name: 'john', age: 22, });
    router.add('/male/robert', { name: 'robert', age: 18, });
    router.add('/male/david', { name: 'david', age: 40, });
    router.add('/citys/1', ['new york', 'london', 'tokyo']);
    router.add('/citys/2', ['pairs', 'beijing', 'los angeles']);
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
  });
});
