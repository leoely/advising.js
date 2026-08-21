import { describe, expect, test, } from '@jest/globals';
import IntegerRouter from '~/class/IntegerRouter';

describe('[Class] IntegerRouter;', () => {
  test('IntegerRouter should be able to use different integers..', () => {
    const integerRouter = new IntegerRouter({
      threshold: 0.5,
      number: 10,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    integerRouter.attach(42342, { value: 42342, });
    integerRouter.attach(53982, { value: 53982, });
    expect(JSON.stringify(integerRouter.gain(42342))).toMatch('{\"value\":42342}');
    expect(JSON.stringify(integerRouter.gain(53982))).toMatch('{\"value\":53982}');
    integerRouter.attach(8942, { value: 8942, });
    expect(JSON.stringify(integerRouter.gain(8942))).toMatch('{\"value\":8942}');
    integerRouter.attach(3849, { value: 3849, });
    expect(JSON.stringify(integerRouter.gain(3849))).toMatch('{\"value\":3849}');
    expect(JSON.stringify(integerRouter.gain(3849))).toMatch('{\"value\":3849}');
    expect(JSON.stringify(integerRouter.gain(3849))).toMatch('{\"value\":3849}');
    expect(JSON.stringify(integerRouter.gain(3849))).toMatch('{\"value\":3849}');
    expect(JSON.stringify(integerRouter.gain(42342))).toMatch('{\"value\":42342}');
    expect(JSON.stringify(integerRouter.gain(42342))).toMatch('{\"value\":42342}');
    expect(JSON.stringify(integerRouter.gain(42342))).toMatch('{\"value\":42342}');
    expect(JSON.stringify(integerRouter.keys())).toMatch('[\"3849\",\"8942\",\"42342\",\"53982\"]');
  });
});
