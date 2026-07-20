import { describe, expect, test, } from '@jest/globals';
import NamespaceRouter from '~/class/NamespaceRouter';

describe('[Class] ObjectRouter;', () => {
  test('NamespaceRouter should be able to obtain corresponding things.', () => {
    const namespaceRouter = new NamespaceRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
      hideError: true,
    });
    namespaceRouter.attach('mem>chk', { type: 'memoryCheck' });
    expect(JSON.stringify(namespaceRouter.gain('mem>chk'))).toMatch('{\"type\":\"memoryCheck\"}');
  });
});
