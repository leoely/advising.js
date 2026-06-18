import { describe, expect, test, } from '@jest/globals';
import ObjectRouter from '~/class/ObjectRouter';

describe('[Class] ObjectRouter;', () => {
  test('ObjectRouter should be able to obtain corresponding things.', () => {
    const objectRouter = new ObjectRouter({
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
    objectRouter.attach('obj1.pro1', { value: 10, });
    objectRouter.ruin('obj1.pro1');
    objectRouter.attach('obj1.pro2', { value: 20, });
    expect(objectRouter.gain('obj1.pro1')).toBe(undefined);
    expect(JSON.stringify(objectRouter.gain('obj1.pro2'))).toMatch('{\"value\":20}');
  });
});
