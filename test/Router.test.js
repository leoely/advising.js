import { describe, expect, test, } from '@jest/globals';
import Router from '~/class/Router';

describe('[class] Router', () => {
  test('Router match result should be correct.', () => {
    const router = new Router(0.5);
    router.add('/find/name/john', { name: 'john', });
    router.add('/find/name/robert', { name: 'robert', });
    router.add('/find/name/david', { name: 'david', });
    expect(JSON.stringify(router.match('/find/name/john'))).toMatch('{\"name\":\"john\"}');
    expect(JSON.stringify(router.match('/find/name/robert'))).toMatch('{\"name\":\"robert\"}');
    expect(JSON.stringify(router.match('/find/name/david'))).toMatch('{\"name\":\"david\"}');
    expect(JSON.stringify(router.match('/find/name/david'))).toMatch('{\"name\":\"david\"}');
    expect(JSON.stringify(router.match('/find/name/david'))).toMatch('{\"name\":\"david\"}');
    expect(JSON.stringify(router.match('/find/name/david'))).toMatch('{\"name\":\"david\"}');
    expect(JSON.stringify(router.match('/find/name/david'))).toMatch('{\"name\":\"david\"}');
    expect(JSON.stringify(router.match('/find/name/david'))).toMatch('{\"name\":\"david\"}');
    expect(JSON.stringify(router.match('/find/name/david'))).toMatch('{\"name\":\"david\"}');
    expect(JSON.stringify(router.match('/find/name/robert'))).toMatch('{\"name\":\"robert\"}');
  });
});
