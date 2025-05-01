import { describe, expect, test, } from '@jest/globals';
import Router from '~/class/Router';

describe('[class] Router time complex test case.', () => {
  test('Router match result should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      bond: 5,
      dutyCycle: 5,
      logLevel: 3,
      logInterval: 5,
      logPath: '/tmp/log/'
    });
    router.add('/male/john', { name: 'john', age: 22, });
    router.add('/male/robert', { name: 'robert', age: 18, });
    router.add('/male/david', { name: 'david', age: 40, });
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
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

  test('Router add router after match result should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      bond: 5,
      dutyCycle: 5,
      logLevel: 3,
      logInterval: 5,
      logPath: '/tmp/log/'
    });
    router.add('/male/john', { name: 'john', age: 22, });
    router.add('/male/robert', { name: 'robert', age: 18, });
    router.add('/male/david', { name: 'david', age: 40, });
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    router.add('/male', ['john', 'robert', 'david']);
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male'))).toMatch('[\"john\",\"robert\",\"david\"]');
  });

  test('Router root mixture generate from thing result should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      bond: 5,
      dutyCycle: 5,
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

  test('Router root mixture generate from noderesult should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      bond: 5,
      dutyCycle: 5,
      logLevel: 3,
      logInterval: 5,
      logPath: '/tmp/log/'
    });
    router.add('/male/john', { name: 'john', age: 22, });
    router.add('/male/robert', { name: 'robert', age: 18, });
    router.add('/male/david', { name: 'david', age: 40, });
    router.add('/male', ['john', 'robert', 'david']);
    expect(JSON.stringify(router.match('/male'))).toMatch('[\"john\",\"robert\",\"david\"]');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
  });

  test('Router middle mixture from node generate result should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      bond: 5,
      dutyCycle: 5,
      logLevel: 3,
      logInterval: 5,
      logPath: '/tmp/log/'
    });
    router.add('/country/unitedKingdom/london', { id: 1, name: 'london',});
    router.add('/country/unitedKingdom/england', { id: 2, name: 'england',});
    router.add('/country/unitedKingdom/liverpool', { id: 3, name: 'liveprool',  });
    router.add('/country/unitedKingdom/belfast', { id: 4, name: 'belfast', });
    router.add('/country', ['united kingdom']);
    expect(JSON.stringify(router.match('/country/unitedKingdom/london'))).toMatch('{\"id\":1,\"name\":\"london\"}');
    expect(JSON.stringify(router.match('/country/unitedKingdom/england'))).toMatch('{\"id\":2,\"name\":\"england\"}');
    expect(JSON.stringify(router.match('/country/unitedKingdom/liverpool'))).toMatch('{\"id\":3,\"name\":\"liveprool\"}');
    expect(JSON.stringify(router.match('/country/unitedKingdom/belfast'))).toMatch('{\"id\":4,\"name\":\"belfast\"}');
    expect(JSON.stringify(router.match('/country'))).toMatch('[\"united kingdom\"]');
  });

  test('Router should support pure numbers and letters formate.', () => {
    const router = new Router({
      threshold: 0.1,
      bond: 5,
      dutyCycle: 5,
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
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
  });
});

describe('[Class] Router space complex case.', () => {
  test('', () => {
  });
});

describe('[Class] Router miscellaneous case..', () => {
  test('Router should prevent include both numbers and letters.', () => {
    const router = new Router({
      threshold: 0.5,
      bond: 5,
      dutyCycle: 5,
      logLevel: 3,
      logInterval: 5,
      logPath: '/tmp/log/'
    });
    router.add('/chaos/letter', { type: 'letter', });
    expect(() => router.add('/chaos/1', { type: 'number' })).toThrow('[Error] This node is pure numbers node,add content must is numbers.');
  });

  test('Router should prevent include both numbers and letters.', () => {
    const router = new Router({
      threshold: 0.5,
      bond: 5,
      dutyCycle: 5,
      logLevel: 3,
      logInterval: 5,
      logPath: '/tmp/log/'
    });
    router.add('/chaos/1', { type: 'number', });
    expect(() => router.add('/chaos/letter', { type: 'letter' })).toThrow('[Error] This node is pure letters node but content must is letters.');
  });

  test('Router key should compose of pure numbers and letters.', () => {
    const router = new Router({
      threshold: 0.5,
      bond: 5,
      dutyCycle: 5,
      logLevel: 3,
      logInterval: 5,
      logPath: '/tmp/log/'
    });
    expect(() => router.add('/chaos/a1', { type: 'numbers' })).toThrow('[Error] Key must is pure numbers or pure letters.');
    expect(() => router.add('/chaos/1a', { type: 'numbers' })).toThrow('[Error] Key must is pure numbers or pure letters.');
  });

  test('Router key must is string type.', () => {
    const router = new Router({
      threshold: 0.5,
      bond: 5,
      dutyCycle: 5,
      logLevel: 3,
      logInterval: 5,
      logPath: '/tmp/log/'
    });
    expect(() => router.add(11111, { type: 'numbers' })).toThrow('[Error] Key type must is string.');
    expect(() => router.add({}, { type: 'object' })).toThrow('[Error] Key type must is string.');
    expect(() => router.add([], { type: 'array' })).toThrow('[Error] Key type must is string.');
  });

  test('Router default options should exist.', () => {
    const router = new Router();
    expect(typeof router.options).toMatch('object');
  });

  test('Router logLevel should be setting correct..', () => {
    const router = new Router({
      threshold: 0.5,
      bond: 5,
      dutyCycle: 5,
      logLevel: 4,
      logInterval: 5,
      logPath: '/tmp/log/'
    });
    router.add('/male/john', { name: 'john', age: 22, });
    router.match('/male/john');
    router.match('/male/john');
    router.match('/male/john');
    router.match('/male/john');
    expect(() => router.match('/male/john')).toThrow('[Error] LogLevel must in set {1, 2, 3}.');
  });
});
