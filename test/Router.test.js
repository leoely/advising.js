import { describe, expect, test, } from '@jest/globals';
import Router from '~/class/Router';

describe('[class] Router', () => {
  //test('Router match result should be correct.', () => {
    //const router = new Router({
      //threshold: 0.5,
      //bond: 5,
      //logLevel: 3,
      //logInterval: 5,
      //logPath: '/tmp/log/'
    //});
    //router.add('/get/male/john', { name: 'john', age: 22, });
    //router.add('/get/male/robert', { name: 'robert', age: 18, });
    //router.add('/get/male/david', { name: 'david', age: 40, });
    //router.add('/get/male', ['john', 'robert', 'david']);
    //expect(JSON.stringify(router.match('/get/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    //expect(JSON.stringify(router.match('/get/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    //expect(JSON.stringify(router.match('/get/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    //expect(JSON.stringify(router.match('/get/male'))).toMatch('[\"john\",\"robert\",\"david\"]');
    //expect(JSON.stringify(router.match('/get/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    //expect(JSON.stringify(router.match('/get/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    //expect(JSON.stringify(router.match('/get/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    //expect(JSON.stringify(router.match('/get/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    //expect(JSON.stringify(router.match('/get/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    //expect(JSON.stringify(router.match('/get/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    //expect(JSON.stringify(router.match('/get/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    //expect(JSON.stringify(router.match('/get/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    //expect(JSON.stringify(router.match('/get/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    //expect(JSON.stringify(router.match('/get/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    //expect(JSON.stringify(router.match('/get/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    //expect(JSON.stringify(router.match('/get/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    //expect(JSON.stringify(router.match('/get/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    //expect(JSON.stringify(router.match('/get/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
  //});

  test('Router mixture generate result should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      bond: 5,
      logLevel: 3,
      logInterval: 5,
      logPath: '/tmp/log/'
    });
    router.add('/get/male', ['john', 'robert', 'david']);
    router.add('/get/male/john', { name: 'john', age: 22, });
    router.add('/get/male/robert', { name: 'robert', age: 18, });
    router.add('/get/male/david', { name: 'david', age: 40, });
    expect(JSON.stringify(router.match('/get/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/get/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/get/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/get/male'))).toMatch('[\"john\",\"robert\",\"david\"]');
  });
});
